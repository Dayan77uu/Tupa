from datetime import datetime

from app.extensions import db
from app.models.expediente import Expediente
from app.models.movimiento import MovimientoExpediente, ESTADOS_COLOR
from app.notificaciones.service import notificar

ESTADO_LABEL = {
    "BORRADOR": "Borrador",
    "PENDIENTE": "Pendiente",
    "EN_REVISION": "En revisión",
    "OBSERVADO": "Observado",
    "APROBADO": "Aprobado",
    "RECHAZADO": "Rechazado",
}

MENSAJE_NO_ENCONTRADO = "Expediente no encontrado"
MENSAJE_NO_AUTORIZADO = "No tiene acceso a este expediente"


def registrar_movimiento(
    nro_expediente: str,
    estado_nuevo: str,
    comentario: str = None,
    usuario_responsable: str = None,
    id_requisito_observado: int = None,
):
    """Cambia el estado de un expediente y deja constancia inmutable en
    tmovimientoexpediente. Notifica automaticamente al dueno del expediente.
    Reutilizable por cualquier modulo que necesite cambiar el estado (Sprint 3
    en adelante: subsanacion, endpoint temporal de pruebas, y en el futuro el
    panel administrativo de Sprint 4)."""
    expediente = Expediente.query.filter_by(cnroexpediente=nro_expediente).first()
    if expediente is None:
        return None

    estado_anterior = expediente.cestado

    db.session.add(
        MovimientoExpediente(
            nro_expediente=nro_expediente,
            estado_anterior=estado_anterior,
            estado_nuevo=estado_nuevo,
            comentario=comentario,
            id_requisito_observado=id_requisito_observado,
            usuario_responsable=usuario_responsable,
        )
    )
    expediente.cestado = estado_nuevo
    db.session.commit()

    mensaje = f"Tu expediente {nro_expediente} cambió a estado {ESTADO_LABEL.get(estado_nuevo, estado_nuevo)}."
    if comentario:
        mensaje += f" {comentario}"
    notificar(expediente.cidtusuario, nro_expediente, mensaje)

    return expediente


def obtener_mis_expedientes(cidtusuario: str):
    expedientes = (
        Expediente.query.filter(
            Expediente.cidtusuario == cidtusuario, Expediente.cestado != "BORRADOR"
        )
        .order_by(Expediente.dfecharegistro.desc())
        .all()
    )

    hoy = datetime.utcnow()
    resultado = []
    for e in expedientes:
        dias_transcurridos = (hoy - e.dfecharegistro).days if e.dfecharegistro else None
        resultado.append(
            {
                "nro_expediente": e.cnroexpediente,
                "nombre_tramite": e.tramite.cdenominaciontramite if e.tramite else None,
                "estado": e.cestado,
                "estado_label": ESTADO_LABEL.get(e.cestado, e.cestado),
                "color": ESTADOS_COLOR.get(e.cestado, "gris"),
                "fecha_registro": e.dfecharegistro.isoformat() if e.dfecharegistro else None,
                "dias_transcurridos": dias_transcurridos,
            }
        )
    return resultado


def obtener_historial(nro_expediente: str, cidtusuario: str):
    expediente = Expediente.query.filter_by(cnroexpediente=nro_expediente).first()
    if expediente is None:
        return 404, {"error": MENSAJE_NO_ENCONTRADO}
    if expediente.cidtusuario != cidtusuario:
        return 403, {"error": MENSAJE_NO_AUTORIZADO}

    movimientos = (
        MovimientoExpediente.query.filter_by(nro_expediente=nro_expediente)
        .order_by(MovimientoExpediente.fecha_hora.asc())
        .all()
    )

    return 200, {
        "nro_expediente": nro_expediente,
        "estado_actual": expediente.cestado,
        "historial": [
            {
                "estado_anterior": m.estado_anterior,
                "estado_nuevo": m.estado_nuevo,
                "comentario": m.comentario,
                "fecha_hora": m.fecha_hora.isoformat() if m.fecha_hora else None,
            }
            for m in movimientos
        ],
    }
