from datetime import datetime, timedelta

import jwt
from sqlalchemy import func

from app.extensions import db, bcrypt
from app.config import Config
from app.models.usuario import Usuario, Login, RegistroAuditoria

DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe"
MAX_INTENTOS_FALLIDOS = 5
MINUTOS_BLOQUEO = 15
MINUTOS_EXPIRACION_TOKEN = 30
MENSAJE_CREDENCIALES_INVALIDAS = "Correo o contraseña incorrectos"
MENSAJE_ERROR_SISTEMA = "Error de conexión. Intente nuevamente."


def dominio_valido(correo: str) -> bool:
    return bool(correo) and correo.strip().lower().endswith(DOMINIO_INSTITUCIONAL)


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
