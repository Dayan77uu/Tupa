import re
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from urllib.parse import quote_plus

import jwt
from sqlalchemy import func

from app.extensions import db, bcrypt
from app.config import Config
from app.models.usuario import Usuario, Login, RegistroAuditoria, Perfil
from app.models.perfil_academico import Alumno

DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe"
MAX_INTENTOS_FALLIDOS = 5
MINUTOS_BLOQUEO = 15
MINUTOS_EXPIRACION_TOKEN = 30
MINUTOS_EXPIRACION_VERIFICACION = 60
MENSAJE_CREDENCIALES_INVALIDAS = "Correo o contraseña incorrectos"
MENSAJE_ERROR_SISTEMA = "Error de conexión. Intente nuevamente."
MENSAJE_CUENTA_NO_ACTIVADA = "Esta cuenta aún no ha sido verificada. Revisa tu correo de verificación."
MENSAJE_DATOS_NO_COINCIDEN = "Los datos ingresados no coinciden con ningún registro."
MENSAJE_CUENTA_YA_ACTIVADA = "La cuenta ya fue verificada. Usa \"Olvidé mi contraseña\"."
MENSAJE_REGISTRO_REQUERIDO = (
    "Si aún no tienes cuenta, proporciona codigoalumno, dni y una contraseña segura "
    "para registrarte." 
)

REGEX_CONTRASENA_VALIDA = re.compile(r"^(?=.*[A-Z])(?=.*\d).{8,}$")


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


def _armar_correo(codigoalumno: str) -> str:
    return f"{codigoalumno.strip().lower()}@unsaac.edu.pe"


def _generar_token_verificacion(correo: str, codigoalumno: str, dni: str) -> str:
    payload = {
        "purpose": "email_verificacion",
        "correo": correo.strip().lower(),
        "codigoalumno": codigoalumno.strip(),
        "dni": dni.strip(),
        "exp": datetime.utcnow() + timedelta(minutes=MINUTOS_EXPIRACION_VERIFICACION),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def _enviar_correo(destinatario: str, asunto: str, cuerpo: str) -> bool:
    if not Config.SMTP_HOST or not Config.SMTP_USER or not Config.SMTP_PASSWORD:
        print(f"[SIMULADO] correo a {destinatario}: {asunto}\n{cuerpo}")
        return False

    email = EmailMessage()
    email["Subject"] = asunto
    email["From"] = Config.SMTP_FROM or Config.SMTP_USER
    email["To"] = destinatario
    email.set_content(cuerpo)

    with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT) as servidor:
        servidor.starttls()
        servidor.login(Config.SMTP_USER, Config.SMTP_PASSWORD)
        servidor.send_message(email)
    return True


def _crear_cuenta_alumno(codigoalumno: str, contrasena: str, dni: str):
    perfil_estudiante = Perfil.query.filter_by(cdescripcionperfil="ESTUDIANTE").first()
    if perfil_estudiante is None:
        return None, "No existe el perfil ESTUDIANTE en la base de datos."

    alumno = Alumno.query.filter_by(codigoalumno=codigoalumno.strip(), dni=dni.strip()).first()
    if alumno is None:
        return None, MENSAJE_DATOS_NO_COINCIDEN

    if db.session.get(Usuario, dni.strip()):
        return None, "Ya existe una cuenta con ese DNI. Usa tu correo y contraseña para iniciar sesión."

    correo_generado = _armar_correo(codigoalumno)
    usuario = Usuario(
        cidtusuario=dni.strip(),
        nidttipousuario=1,
        cdni=dni.strip(),
        ccodigo=codigoalumno.strip(),
        cnombres=alumno.nombresalumno or "",
        cpaterno=alumno.apalumno or "",
        cmaterno=alumno.amalumno or "",
        ccorreo=correo_generado,
    )
    db.session.add(usuario)

    login = Login(
        clogin=dni.strip(),
        cidtusuario=dni.strip(),
        nidtperfil=perfil_estudiante.nidtperfil,
        ccontrasenia=bcrypt.generate_password_hash(contrasena, rounds=12).decode("utf-8"),
        intentos_fallidos=0,
        activada=False,
    )
    db.session.add(login)
    db.session.commit()

    return login, correo_generado


def autenticar(correo: str, contrasena: str, ip: str, codigoalumno: str = "", dni: str = ""):
    """Devuelve (status_code, body_dict)."""

    correo_input = correo.strip().lower() if correo else ""
    correo_generado = _armar_correo(codigoalumno) if codigoalumno else ""
    correo_normalizado = correo_input or correo_generado

    if correo_input and not dominio_valido(correo_input):
        return 400, {"error": "Solo se aceptan correos institucionales UNSAAC"}

    if codigoalumno and correo_input and correo_input != correo_generado:
        return 400, {
            "error": (
                f"El correo debe ser el institucional generado por el código de alumno: {correo_generado}"
            )
        }

    try:
        usuario = None
        if correo_normalizado:
            usuario = Usuario.query.filter(func.lower(Usuario.ccorreo) == correo_normalizado).first()

        if usuario is None:
            if not codigoalumno or not dni or not contrasena:
                return 400, {"error": MENSAJE_REGISTRO_REQUERIDO}

            if not contrasena_valida(contrasena):
                return 400, {
                    "error": "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
                }

            login, correo_generado = _crear_cuenta_alumno(codigoalumno, contrasena, dni)
            if isinstance(correo_generado, str) and not login:
                _registrar_auditoria(correo_normalizado, ip, "FALLIDO")
                return 401, {"error": correo_generado}
            if login is None:
                _registrar_auditoria(correo_normalizado, ip, "FALLIDO")
                return 401, {"error": "No se pudo crear la cuenta. Verifica los datos."}

            token_verificacion = _generar_token_verificacion(correo_generado, codigoalumno, dni)
            link = (
                f"{Config.BACKEND_URL}/api/auth/verificar-email?token={quote_plus(token_verificacion)}"
            )
            asunto = "Verifica tu cuenta TUPA UNSAAC"
            cuerpo = (
                f"Hola,\n\n"
                f"Se ha solicitado el registro de una nueva cuenta para el sistema TUPA.\n"
                f"Tu correo institucional generado es: {correo_generado}\n\n"
                f"Haz clic en el siguiente enlace para verificar tu correo y poder iniciar sesión:\n\n"
                f"{link}\n\n"
                f"Si no solicitaste este registro, ignora este correo.\n"
            )
            _enviar_correo(correo_generado, asunto, cuerpo)
            _registrar_auditoria(correo_normalizado, ip, "EXITOSO")
            return 202, {
                "mensaje": "Se te envio un correo de verificacion a tu bandeja de mensajes"
            }

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


def verificar_email(token: str):
    if not token:
        return 400, {"error": "El token de verificación es requerido."}

    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return 400, {"error": "El enlace de verificación expiró."}
    except jwt.InvalidTokenError:
        return 400, {"error": "El enlace de verificación es inválido."}

    if payload.get("purpose") != "email_verificacion":
        return 400, {"error": "El enlace de verificación no es válido."}

    correo = payload.get("correo")
    codigoalumno = payload.get("codigoalumno")
    dni = payload.get("dni")
    if not correo or not codigoalumno or not dni:
        return 400, {"error": "Datos de verificación incompletos."}

    alumno = Alumno.query.filter_by(codigoalumno=codigoalumno, dni=dni).first()
    if alumno is None:
        return 400, {"error": MENSAJE_DATOS_NO_COINCIDEN}

    usuario = Usuario.query.filter(func.lower(Usuario.ccorreo) == correo.lower()).first()
    if usuario is None or usuario.cidtusuario != dni:
        return 400, {"error": "La cuenta de usuario no coincide con los datos verificados."}

    login = Login.query.filter_by(cidtusuario=dni).first()
    if login is None:
        return 400, {"error": "Cuenta de login no encontrada."}

    if login.activada:
        return 200, {"mensaje": "La cuenta ya estaba verificada. Inicia sesión."}

    login.activada = True
    login.intentos_fallidos = 0
    login.fecha_bloqueo = None
    db.session.commit()

    return 200, {"mensaje": "Cuenta verificada correctamente. Ya puedes iniciar sesión."}

def activar_cuenta(codigoalumno: str, dni: str, nueva_contrasena: str, ip: str):
    if not codigoalumno or not dni or not nueva_contrasena:
        return 400, {"error": "Faltan datos requeridos."}

    if not contrasena_valida(nueva_contrasena):
        return 400, {"error": "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."}

    alumno = Alumno.query.filter_by(codigoalumno=codigoalumno.strip(), dni=dni.strip()).first()
    if not alumno:
        return 404, {"error": "No se encontró un alumno con ese código y DNI."}
        
    usuario = db.session.get(Usuario, dni.strip())
    if not usuario:
        # Create it if it doesn't exist (e.g. if they didn't run the pre-create script)
        login, correo_generado = _crear_cuenta_alumno(codigoalumno, nueva_contrasena, dni)
        if not login:
            return 500, {"error": "Error al crear la cuenta."}
        login.activada = True
        db.session.commit()
        _registrar_auditoria(correo_generado, ip, "ACTIVACION_CUENTA_Y_CREACION")
        return 200, {"mensaje": "Cuenta creada y activada correctamente"}

    login = Login.query.filter_by(cidtusuario=usuario.cidtusuario).first()
    if not login:
        return 404, {"error": "El usuario no tiene credenciales de acceso."}
        
    if login.activada:
        return 400, {"error": "Esta cuenta ya fue activada anteriormente."}
        
    login.ccontrasenia = bcrypt.generate_password_hash(nueva_contrasena, rounds=12).decode("utf-8")
    login.activada = True
    login.intentos_fallidos = 0
    login.fecha_bloqueo = None
    db.session.commit()
    
    _registrar_auditoria(usuario.ccorreo, ip, "ACTIVACION_CUENTA")
    return 200, {"mensaje": "Tu cuenta ha sido activada correctamente"}

