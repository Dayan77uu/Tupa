import re
import secrets
from datetime import datetime, timedelta

import jwt
from flask_mail import Message
from sqlalchemy import func

from app.extensions import db, bcrypt, mail
from app.config import Config
from app.models.usuario import Usuario, Login, Perfil, RegistroAuditoria
from app.models.perfil_academico import Alumno
from app.models.registro import UsuarioPendiente

DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe"
MAX_INTENTOS_FALLIDOS = 5
MINUTOS_BLOQUEO = 15
MINUTOS_EXPIRACION_TOKEN = 30
MENSAJE_CREDENCIALES_INVALIDAS = "Correo o contraseña incorrectos"
MENSAJE_ERROR_SISTEMA = "Error de conexión. Intente nuevamente."
MENSAJE_CUENTA_NO_ACTIVADA = "Esta cuenta aún no ha sido activada."
MENSAJE_DATOS_NO_COINCIDEN = "Los datos ingresados no coinciden con ningún registro."
MENSAJE_CUENTA_YA_ACTIVADA = "Esta cuenta ya fue activada. Usa \"Olvidé mi contraseña\"."
MENSAJE_REGISTRO_RECIBIDO = "Si el correo es válido y no está registrado, te enviamos un enlace de verificación."

REGEX_CONTRASENA_VALIDA = re.compile(r"^(?=.*[A-Z])(?=.*\d).{8,}$")
HORAS_EXPIRACION_TOKEN_REGISTRO = 24


def dominio_valido(correo: str) -> bool:
    return bool(correo) and correo.strip().lower().endswith(DOMINIO_INSTITUCIONAL)


def contrasena_valida(contrasena: str) -> bool:
    return bool(contrasena) and bool(REGEX_CONTRASENA_VALIDA.match(contrasena))


def _registrar_auditoria(correo: str, ip: str, resultado: str) -> None:
    db.session.add(
        RegistroAuditoria(correo_ingresado=correo, direccion_ip=ip, resultado=resultado)
    )
    db.session.commit()


def _generar_token(id_usuario: str, rol: str) -> str:
    payload = {
        "id_usuario": id_usuario,
        "rol": rol,
        "exp": datetime.utcnow() + timedelta(minutes=MINUTOS_EXPIRACION_TOKEN),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def autenticar(correo: str, contrasena: str, ip: str):
    """Devuelve (status_code, body_dict)."""

    if not dominio_valido(correo):
        return 400, {"error": "Solo se aceptan correos institucionales UNSAAC"}

    try:
        usuario = Usuario.query.filter(func.lower(Usuario.ccorreo) == correo.lower()).first()

        if usuario is None:
            _registrar_auditoria(correo, ip, "FALLIDO")
            return 401, {"error": MENSAJE_CREDENCIALES_INVALIDAS}

        login = Login.query.filter_by(cidtusuario=usuario.cidtusuario).first()

        if login is None:
            _registrar_auditoria(correo, ip, "FALLIDO")
            return 401, {"error": MENSAJE_CREDENCIALES_INVALIDAS}

        if not login.activada:
            _registrar_auditoria(correo, ip, "FALLIDO")
            return 403, {"error": MENSAJE_CUENTA_NO_ACTIVADA, "cuenta_pendiente_activacion": True}

        ahora = datetime.utcnow()

        if login.fecha_bloqueo and login.fecha_bloqueo > ahora:
            minutos_restantes = max(1, int((login.fecha_bloqueo - ahora).total_seconds() // 60) + 1)
            _registrar_auditoria(correo, ip, "FALLIDO")
            return 403, {
                "error": f"Cuenta bloqueada temporalmente. Intente en {minutos_restantes} minutos."
            }

        contrasena_correcta = login.ccontrasenia and bcrypt.check_password_hash(
            login.ccontrasenia, contrasena
        )

        if not contrasena_correcta:
            login.intentos_fallidos = (login.intentos_fallidos or 0) + 1

            if login.intentos_fallidos >= MAX_INTENTOS_FALLIDOS:
                login.fecha_bloqueo = ahora + timedelta(minutes=MINUTOS_BLOQUEO)
                db.session.commit()
                _registrar_auditoria(correo, ip, "FALLIDO")
                return 403, {
                    "error": f"Cuenta bloqueada temporalmente. Intente en {MINUTOS_BLOQUEO} minutos."
                }

            db.session.commit()
            _registrar_auditoria(correo, ip, "FALLIDO")
            return 401, {"error": MENSAJE_CREDENCIALES_INVALIDAS}

        login.intentos_fallidos = 0
        login.fecha_bloqueo = None
        db.session.commit()

        rol = login.perfil.cdescripcionperfil if login.perfil else None
        token = _generar_token(usuario.cidtusuario, rol)

        _registrar_auditoria(correo, ip, "EXITOSO")
        return 200, {"token": token, "rol": rol}

    except Exception:
        db.session.rollback()
        try:
            _registrar_auditoria(correo, ip, "ERROR_SISTEMA")
        except Exception:
            db.session.rollback()
        return 500, {"error": MENSAJE_ERROR_SISTEMA}


def activar_cuenta(codigoalumno: str, dni: str, nueva_contrasena: str):
    """Establece la contrasena propia de un alumno real (talumno) para su
    cuenta ya provisionada (tusuario/tlogin, ver scripts/cargar_alumnos_reales.py),
    verificando codigoalumno + DNI como par de identidad. No revela cual de los
    dos datos fallo si no coinciden."""

    if not codigoalumno or not dni or not nueva_contrasena:
        return 400, {"error": "codigoalumno, dni y nueva_contrasena son requeridos"}

    alumno = Alumno.query.filter_by(codigoalumno=codigoalumno.strip(), dni=dni.strip()).first()
    if alumno is None:
        return 401, {"error": MENSAJE_DATOS_NO_COINCIDEN}

    login = Login.query.filter_by(cidtusuario=dni.strip()).first()
    if login is None:
        return 401, {"error": MENSAJE_DATOS_NO_COINCIDEN}

    if login.activada:
        return 400, {"error": MENSAJE_CUENTA_YA_ACTIVADA}

    if not contrasena_valida(nueva_contrasena):
        return 400, {
            "error": "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
        }

    login.ccontrasenia = bcrypt.generate_password_hash(nueva_contrasena, rounds=12).decode("utf-8")
    login.activada = True
    login.intentos_fallidos = 0
    login.fecha_bloqueo = None
    db.session.commit()

    return 200, {"mensaje": "Cuenta activada correctamente. Ya puedes iniciar sesión."}


def _generar_cidtusuario_registro() -> str:
    """cidtusuario para cuentas auto-registradas (sin talumno detras): prefijo
    'REG' + secuencial, para distinguirlas a simple vista de los DNIs reales
    (8 digitos) y de las cuentas sinteticas de demo (00000001-5, 90000001-4)."""
    ultimo = (
        Usuario.query.filter(Usuario.cidtusuario.like("REG%"))
        .order_by(Usuario.cidtusuario.desc())
        .first()
    )
    siguiente = int(ultimo.cidtusuario[3:]) + 1 if ultimo else 1
    return f"REG{siguiente:07d}"


def _enviar_correo_verificacion(email: str, nombre: str, token: str) -> None:
    enlace = f"{Config.FRONTEND_URL}/verificar-correo?token={token}"
    mensaje = Message(
        subject="Verifica tu correo - Plataforma TUPA UNSAAC",
        recipients=[email],
        body=(
            f"Hola {nombre},\n\n"
            "Gracias por registrarte en la Plataforma TUPA UNSAAC.\n"
            f"Verifica tu correo entrando a este enlace (valido por {HORAS_EXPIRACION_TOKEN_REGISTRO} horas):\n"
            f"{enlace}\n\n"
            "Si no solicitaste esto, ignora este correo."
        ),
    )
    mail.send(mensaje)


def registrar(email: str, nombre: str, password: str, confirmar_password: str):
    """Registro con verificacion por correo (Sprint 6): unica via real para que
    un estudiante cree cuenta hoy, dado que talumno esta vacia. No reemplaza
    activar-cuenta.html. No confirma ni niega si el correo ya existia."""

    if not email or not nombre or not password or not confirmar_password:
        return 400, {"error": "Todos los campos son requeridos"}

    email = email.strip().lower()
    nombre = nombre.strip()

    if not dominio_valido(email):
        return 400, {"error": "Solo se aceptan correos institucionales UNSAAC"}

    if password != confirmar_password:
        return 400, {"error": "Las contraseñas no coinciden"}

    if not contrasena_valida(password):
        return 400, {
            "error": "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
        }

    ya_existe = (
        Usuario.query.filter(func.lower(Usuario.ccorreo) == email).first() is not None
        or UsuarioPendiente.query.filter_by(email=email).first() is not None
    )

    if not ya_existe:
        token = secrets.token_hex(32)
        pendiente = UsuarioPendiente(
            email=email,
            nombre=nombre,
            password_hash=bcrypt.generate_password_hash(password, rounds=12).decode("utf-8"),
            token=token,
            token_expira=datetime.utcnow() + timedelta(hours=HORAS_EXPIRACION_TOKEN_REGISTRO),
        )
        db.session.add(pendiente)
        db.session.commit()

        try:
            _enviar_correo_verificacion(email, nombre, token)
        except Exception as error:
            # El registro pendiente queda guardado igual; no revelamos detalles
            # del error de envio en la respuesta al cliente, pero si se loguea
            # en el servidor para poder diagnosticar fallos de entrega.
            print(f"[correo verificacion] fallo el envio a {email}: {error}")

    return 201, {"mensaje": MENSAJE_REGISTRO_RECIBIDO}


def verificar_correo(token: str):
    if not token:
        return 400, {"error": "Token requerido"}

    pendiente = UsuarioPendiente.query.filter_by(token=token).first()
    if pendiente is None:
        return 400, {"error": "El enlace de verificación no es válido."}

    if pendiente.token_expira < datetime.utcnow():
        return 400, {"error": "El enlace de verificación expiró. Vuelve a registrarte."}

    perfil_estudiante = Perfil.query.filter_by(cdescripcionperfil="ESTUDIANTE").first()
    if perfil_estudiante is None:
        return 500, {"error": MENSAJE_ERROR_SISTEMA}

    cidtusuario = _generar_cidtusuario_registro()

    db.session.add(
        Usuario(
            cidtusuario=cidtusuario,
            nidttipousuario=1,
            cdni=None,
            ccodigo=None,
            cnombres=pendiente.nombre,
            cpaterno=None,
            cmaterno=None,
            ccorreo=pendiente.email,
        )
    )
    db.session.add(
        Login(
            clogin=cidtusuario,
            cidtusuario=cidtusuario,
            nidtperfil=perfil_estudiante.nidtperfil,
            ccontrasenia=pendiente.password_hash,
            intentos_fallidos=0,
            nidtunidadorganizativa=None,
            activada=True,
        )
    )
    db.session.delete(pendiente)
    db.session.commit()

    return 200, {"mensaje": "Correo verificado. Tu cuenta ya está activa, ya puedes iniciar sesión."}
