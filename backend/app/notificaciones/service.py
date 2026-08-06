import smtplib
from email.message import EmailMessage

from app.config import Config
from app.extensions import db
from app.models.notificacion import Notificacion
from app.models.usuario import Usuario


def _enviar_correo(destinatario: str, mensaje: str) -> bool:
    """Devuelve True si se envio realmente, False si quedo en modo simulado."""
    asunto = "TUPA UNSAAC - Actualizacion de tramite"

    if Config.MAILJET_API_KEY:
        from mailjet_rest import Client

        cliente = Client(auth=(Config.MAILJET_API_KEY, Config.MAILJET_API_SECRET), version="v3.1")
        try:
            respuesta = cliente.send.create(data={
                "Messages": [{
                    "From": {"Email": Config.MAILJET_FROM_EMAIL, "Name": "TUPA UNSAAC"},
                    "To": [{"Email": destinatario}],
                    "Subject": asunto,
                    "TextPart": mensaje,
                }]
            })
            return 200 <= respuesta.status_code < 300
        except Exception as e:
            print(f"[ERROR MAILJET] No se pudo enviar correo a {destinatario}: {e}")
            return False

    if not Config.SMTP_HOST or not Config.SMTP_USER or not Config.SMTP_PASSWORD:
        print(f"[SIMULADO] correo a {destinatario}: {mensaje}")
        return False

    email = EmailMessage()
    email["Subject"] = asunto
    email["From"] = Config.SMTP_USER
    email["To"] = destinatario
    email.set_content(mensaje)

    try:
        with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT, timeout=10) as servidor:
            servidor.starttls()
            servidor.login(Config.SMTP_USER, Config.SMTP_PASSWORD)
            servidor.send_message(email)
        return True
    except Exception as e:
        print(f"[ERROR SMTP] No se pudo enviar correo a {destinatario}: {e}")
        return False


def notificar(id_usuario: str, nro_expediente: str, mensaje: str) -> bool:
    """Registra la notificacion en BD y devuelve si el correo se envio de verdad
    (False = quedo en modo simulado por falta de credenciales SMTP)."""
    db.session.add(
        Notificacion(id_usuario=id_usuario, nro_expediente=nro_expediente, mensaje=mensaje)
    )
    db.session.commit()

    usuario = db.session.get(Usuario, id_usuario)
    correo_enviado = False
    if usuario and usuario.ccorreo:
        correo_enviado = _enviar_correo(usuario.ccorreo, mensaje)

    return correo_enviado


def obtener_notificaciones(id_usuario: str):
    notificaciones = (
        Notificacion.query.filter_by(id_usuario=id_usuario)
        .order_by(Notificacion.fecha_hora.desc())
        .all()
    )
    return {
        "no_leidas": sum(1 for n in notificaciones if not n.leida),
        "notificaciones": [
            {
                "id_notificacion": n.id_notificacion,
                "nro_expediente": n.nro_expediente,
                "mensaje": n.mensaje,
                "leida": bool(n.leida),
                "fecha_hora": n.fecha_hora.isoformat() if n.fecha_hora else None,
            }
            for n in notificaciones
        ],
    }


def marcar_leida(id_notificacion: int, id_usuario: str):
    notificacion = db.session.get(Notificacion, id_notificacion)
    if notificacion is None or notificacion.id_usuario != id_usuario:
        return 404, {"error": "Notificacion no encontrada"}

    notificacion.leida = True
    db.session.commit()
    return 200, {"id_notificacion": id_notificacion, "leida": True}
