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

DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe"
MAX_INTENTOS_FALLIDOS = 5
MINUTOS_BLOQUEO = 15
MINUTOS_EXPIRACION_TOKEN = 30
MINUTOS_EXPIRACION_VERIFICACION = 60
MINUTOS_ESPERA_REENVIO = 2

MENSAJE_CREDENCIALES_INVALIDAS = "Código de alumno o contraseña incorrectos."
MENSAJE_CREDENCIALES_INVALIDAS_CORREO = "Correo o contraseña incorrectos."
MENSAJE_ERROR_SISTEMA = "Error de conexión. Intente nuevamente."
MENSAJE_CUENTA_NO_ACTIVADA = "Debes verificar tu correo institucional antes de iniciar sesión."
MENSAJE_CUENTA_YA_ACTIVADA = "La cuenta ya fue verificada. Inicia sesión."
MENSAJE_DATOS_NO_COINCIDEN = "El DNI o código de alumno no son válidos."

REGEX_CONTRASENA_VALIDA = re.compile(r"^(?=.*[A-Z])(?=.*\d).{8,}$")
REGEX_CODIGO_ALUMNO = re.compile(r"^\d+$")
REGEX_DNI = re.compile(r"^\d{8}$")


def dominio_valido(correo: str) -> bool:
    return bool(correo) and correo.strip().lower().endswith(DOMINIO_INSTITUCIONAL)


def contrasena_valida(contrasena: str) -> bool:
    return bool(contrasena) and bool(REGEX_CONTRASENA_VALIDA.match(contrasena))


def _registrar_auditoria(identificador: str, ip: str, resultado: str) -> None:
    db.session.add(
        RegistroAuditoria(correo_ingresado=identificador, direccion_ip=ip, resultado=resultado)
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
    return f"{codigoalumno.strip().lower()}{DOMINIO_INSTITUCIONAL}"


def _generar_token_verificacion(correo: str, codigoalumno: str, dni: str) -> str:
    payload = {
        "purpose": "email_verificacion",
        "correo": correo.strip().lower(),
        "codigoalumno": codigoalumno.strip(),
        "dni": dni.strip(),
        "iat": datetime.utcnow(),
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

    try:
        with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT) as servidor:
            servidor.starttls()
            servidor.login(Config.SMTP_USER, Config.SMTP_PASSWORD)
            servidor.send_message(email)
        return True
    except Exception as e:
        print(f"[ERROR SMTP] No se pudo enviar correo a {destinatario}: {e}")
        return False


def iniciar_sesion(identificador: str, contrasena: str, ip: str):
    """
    Inicia sesión para estudiantes (código) o administrativos (correo).
    Devuelve (status_code, body_dict).
    """
    if not identificador or not contrasena:
        return 400, {"error": "Faltan credenciales."}

    identificador = identificador.strip().lower()
    es_correo = "@" in identificador
    usuario = None

    if es_correo:
        if not dominio_valido(identificador):
            return 400, {"error": "Solo se aceptan correos institucionales UNSAAC."}
        usuario = Usuario.query.filter(func.lower(Usuario.ccorreo) == identificador).first()
        mensaje_invalido = MENSAJE_CREDENCIALES_INVALIDAS_CORREO
    else:
        # Se asume código de alumno (cidtusuario)
        usuario = db.session.get(Usuario, identificador)
        if not usuario:
            # Buscar por si está usando DNI como identificador o el cidtusuario es distinto
            usuario = Usuario.query.filter(
                (func.lower(Usuario.ccodigo) == identificador) | 
                (func.lower(Usuario.cidtusuario) == identificador)
            ).first()
        mensaje_invalido = MENSAJE_CREDENCIALES_INVALIDAS

    if usuario is None:
        _registrar_auditoria(identificador, ip, "FALLIDO")
        return 401, {"error": mensaje_invalido}

    login = Login.query.filter_by(cidtusuario=usuario.cidtusuario).first()

    if login is None:
        _registrar_auditoria(identificador, ip, "FALLIDO")
        return 401, {"error": mensaje_invalido}

    if not login.activada:
        _registrar_auditoria(identificador, ip, "FALLIDO_NO_VERIFICADO")
        return 403, {
            "error": MENSAJE_CUENTA_NO_ACTIVADA, 
            "cuenta_pendiente_activacion": True,
            "codigo_alumno": usuario.ccodigo or usuario.cidtusuario
        }

    ahora = datetime.utcnow()
    if login.fecha_bloqueo and login.fecha_bloqueo > ahora:
        minutos_restantes = max(1, int((login.fecha_bloqueo - ahora).total_seconds() // 60) + 1)
        _registrar_auditoria(identificador, ip, "FALLIDO_BLOQUEADO")
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
            _registrar_auditoria(identificador, ip, "BLOQUEO_ALCANZADO")
            return 403, {
                "error": f"Cuenta bloqueada temporalmente. Intente en {MINUTOS_BLOQUEO} minutos."
            }

        db.session.commit()
        _registrar_auditoria(identificador, ip, "FALLIDO_CLAVE_ERRONEA")
        return 401, {"error": mensaje_invalido}

    login.intentos_fallidos = 0
    login.fecha_bloqueo = None
    db.session.commit()

    rol = login.perfil.cdescripcionperfil if login.perfil else None
    token = _generar_token(usuario.cidtusuario, rol)

    _registrar_auditoria(identificador, ip, "EXITOSO")
    return 200, {"token": token, "rol": rol}


def registrar_alumno(codigo_alumno: str, dni: str, password: str, password_confirmation: str, ip: str):
    """
    Registra un nuevo estudiante sin buscar en talumno.
    Devuelve (status_code, body_dict).
    """
    codigo_alumno = codigo_alumno.strip()
    dni = dni.strip()

    if not codigo_alumno or not dni or not password or not password_confirmation:
        return 400, {"error": "Todos los campos son obligatorios."}

    if not REGEX_CODIGO_ALUMNO.match(codigo_alumno):
        return 400, {"error": "El código de alumno debe contener solamente números."}

    if not REGEX_DNI.match(dni):
        return 400, {"error": "El DNI debe contener exactamente 8 dígitos."}

    if password != password_confirmation:
        return 400, {"error": "Las contraseñas no coinciden."}

    if not contrasena_valida(password):
        return 400, {"error": "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."}

    correo_generado = _armar_correo(codigo_alumno)

    if Usuario.query.filter(
        (Usuario.cidtusuario == codigo_alumno) | 
        (Usuario.ccodigo == codigo_alumno)
    ).first() is not None:
        return 400, {"error": "El código de alumno ya tiene una cuenta registrada."}

    if Usuario.query.filter_by(cdni=dni).first() is not None:
        return 400, {"error": "El DNI ya está asociado a otra cuenta."}

    if Usuario.query.filter_by(ccorreo=correo_generado).first() is not None:
        return 400, {"error": "Ya existe una cuenta registrada con este correo institucional."}

    perfil_estudiante = Perfil.query.filter_by(cdescripcionperfil="ESTUDIANTE").first()
    if perfil_estudiante is None:
        return 500, {"error": "Error interno: No existe el perfil ESTUDIANTE en la base de datos."}

    try:
        usuario = Usuario(
            cidtusuario=codigo_alumno,
            nidttipousuario=1,
            cdni=dni,
            ccodigo=codigo_alumno,
            cnombres="Estudiante",
            cpaterno="UNSAAC",
            cmaterno="",
            ccorreo=correo_generado,
        )
        db.session.add(usuario)

        login = Login(
            clogin=codigo_alumno,
            cidtusuario=codigo_alumno,
            nidtperfil=perfil_estudiante.nidtperfil,
            ccontrasenia=bcrypt.generate_password_hash(password, rounds=12).decode("utf-8"),
            intentos_fallidos=0,
            activada=False,
        )
        db.session.add(login)
        db.session.flush()

        if not _enviar_correo_verificacion(correo_generado, codigo_alumno, dni):
            db.session.rollback()
            _registrar_auditoria(correo_generado, ip, "ERROR_ENVIO_VERIFICACION")
            return 500, {"error": "No se pudo enviar el correo de verificación. Contacta con soporte."}

        db.session.commit()
        _registrar_auditoria(correo_generado, ip, "REGISTRO_EXITOSO")

        return 201, {
            "mensaje": "Cuenta creada correctamente.",
            "correo": correo_generado
        }
    except Exception:
        db.session.rollback()
        _registrar_auditoria(correo_generado, ip, "ERROR_REGISTRO")
        return 500, {"error": MENSAJE_ERROR_SISTEMA}


def _enviar_correo_verificacion(correo: str, codigoalumno: str, dni: str):
    token_verificacion = _generar_token_verificacion(correo, codigoalumno, dni)
    link = f"{Config.BACKEND_URL}/api/auth/verificar-email?token={quote_plus(token_verificacion)}"
    asunto = "Verifica tu cuenta TUPA UNSAAC"
    cuerpo = (
        f"Hola,\n\n"
        f"Se ha creado tu cuenta para el sistema TUPA UNSAAC.\n"
        f"Haz clic en el siguiente enlace para verificar tu correo y poder iniciar sesión:\n\n"
        f"{link}\n\n"
        f"Este enlace expirará en {MINUTOS_EXPIRACION_VERIFICACION} minutos.\n"
        f"Si no solicitaste este registro, ignora este correo.\n"
    )
    return _enviar_correo(correo, asunto, cuerpo)


def reenviar_verificacion(codigo_alumno: str, ip: str):
    codigo_alumno = codigo_alumno.strip()
    if not codigo_alumno:
        return 400, {"error": "El código de alumno es requerido."}

    usuario = Usuario.query.filter(
        (Usuario.cidtusuario == codigo_alumno) | 
        (Usuario.ccodigo == codigo_alumno)
    ).first()

    if not usuario:
        return 404, {"error": "No se encontró ninguna cuenta asociada a este código de alumno."}

    login = Login.query.filter_by(cidtusuario=usuario.cidtusuario).first()
    if not login:
        return 404, {"error": "La cuenta existe pero no tiene credenciales válidas."}

    if login.activada:
        return 400, {"error": MENSAJE_CUENTA_YA_ACTIVADA}

    # Anti-spam: Verificar el último reenvío en auditoría
    ultima_auditoria = RegistroAuditoria.query.filter_by(
        correo_ingresado=usuario.ccorreo,
        resultado="REENVIO_VERIFICACION"
    ).order_by(RegistroAuditoria.fecha.desc()).first()

    ahora = datetime.utcnow()
    if ultima_auditoria:
        minutos_transcurridos = (ahora - ultima_auditoria.fecha).total_seconds() / 60.0
        if minutos_transcurridos < MINUTOS_ESPERA_REENVIO:
            espera = int(MINUTOS_ESPERA_REENVIO - minutos_transcurridos)
            return 429, {"error": f"Por favor espera {espera} minuto(s) antes de solicitar otro correo."}

    try:
        _enviar_correo_verificacion(usuario.ccorreo, usuario.ccodigo or codigo_alumno, usuario.cdni)
        _registrar_auditoria(usuario.ccorreo, ip, "REENVIO_VERIFICACION")
        return 200, {"mensaje": f"Se ha reenviado un mensaje de verificación a {usuario.ccorreo}"}
    except Exception:
        return 500, {"error": "No se pudo enviar el correo de verificación."}


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

    usuario = Usuario.query.filter(func.lower(Usuario.ccorreo) == correo.lower()).first()
    if usuario is None or usuario.cdni != dni:
        return 400, {"error": "La cuenta de usuario no coincide con los datos verificados."}

    login = Login.query.filter_by(cidtusuario=usuario.cidtusuario).first()
    if login is None:
        return 400, {"error": "Cuenta de login no encontrada."}

    if login.activada:
        return 200, {"mensaje": MENSAJE_CUENTA_YA_ACTIVADA}

    login.activada = True
    login.intentos_fallidos = 0
    login.fecha_bloqueo = None
    db.session.commit()

    return 200, {"mensaje": "Cuenta verificada correctamente. Ya puedes iniciar sesión."}
