from datetime import datetime

from app import storage_service
from app.storage_service import StorageError
from app.extensions import db
from app.models.usuario import Usuario, Login
from app.models.expediente import Expediente, DocumentoExpediente
from app.models.tramite import RequisitoTramite, UnidadOrganizativa
from app.models.movimiento import MovimientoExpediente
from app.models.flujo_derivacion import FlujoDerivacion
from app.seguimiento.service import registrar_movimiento, ESTADO_LABEL
from app.notificaciones.service import notificar
from app.dias_habiles import contar_dias_habiles_entre

MENSAJE_NO_ENCONTRADO = "Expediente no encontrado"
MENSAJE_NO_AUTORIZADO = "No tiene acceso a este expediente"

ACCION_A_ESTADO = {"aprobar": "APROBADO", "observar": "OBSERVADO", "rechazar": "RECHAZADO"}


def obtener_oficina_admin(cidtusuario: str):
    login = Login.query.filter_by(cidtusuario=cidtusuario).first()
    return login.nidtunidadorganizativa if login else None


def _color_plazo(fecha_vencimiento):
    if fecha_vencimiento is None:
        return "verde"
    hoy = datetime.utcnow().date()
    if fecha_vencimiento < hoy:
        return "rojo"
    restantes = contar_dias_habiles_entre(hoy, fecha_vencimiento)
    return "amarillo" if restantes <= 1 else "verde"


def obtener_bandeja(cidtusuario: str):
    oficina = obtener_oficina_admin(cidtusuario)
    if oficina is None:
        return None

    expedientes = (
        Expediente.query.filter(
            Expediente.nidtoficinaactual == oficina,
            Expediente.cestado.in_(["PENDIENTE", "EN_REVISION", "OBSERVADO"]),
        )
        .order_by(Expediente.dfecharegistro.asc())
        .all()
    )

    return [
        {
            "nro_expediente": e.cnroexpediente,
            "ccodigo": e.ccodigo,
            "nombre_tramite": e.tramite.cdenominaciontramite if e.tramite else None,
            "estado": e.cestado,
            "estado_label": ESTADO_LABEL.get(e.cestado, e.cestado),
            "fecha_registro": e.dfecharegistro.isoformat() if e.dfecharegistro else None,
            "fecha_vencimiento": e.dfechavencimiento.isoformat() if e.dfechavencimiento else None,
            "color_plazo": _color_plazo(e.dfechavencimiento),
        }
        for e in expedientes
    ]


def _expediente_de_oficina(nro_expediente: str, cidtusuario: str):
    """Devuelve (expediente, error). RN-18: el administrativo solo puede tocar
    expedientes cuya oficina actual coincide con la suya."""
    oficina = obtener_oficina_admin(cidtusuario)
    expediente = Expediente.query.filter_by(cnroexpediente=nro_expediente).first()
    if expediente is None:
        return None, (404, {"error": MENSAJE_NO_ENCONTRADO})
    if oficina is None or expediente.nidtoficinaactual != oficina:
        return None, (403, {"error": MENSAJE_NO_AUTORIZADO})
    return expediente, None


def obtener_detalle(nro_expediente: str, cidtusuario: str):
    expediente, error = _expediente_de_oficina(nro_expediente, cidtusuario)
    if error:
        return error

    solicitante = db.session.get(Usuario, expediente.cidtusuario)
    documentos = DocumentoExpediente.query.filter_by(nidtexpediente=expediente.nidtexpediente).all()
    requisitos = {
        r.nidtrequisitotramite: r
        for r in RequisitoTramite.query.filter_by(ccodigo=expediente.ccodigo).all()
    }
    movimientos = (
        MovimientoExpediente.query.filter_by(nro_expediente=nro_expediente)
        .order_by(MovimientoExpediente.fecha_hora.asc())
        .all()
    )

    return 200, {
        "nro_expediente": nro_expediente,
        "estado": expediente.cestado,
        "estado_label": ESTADO_LABEL.get(expediente.cestado, expediente.cestado),
        "nombre_tramite": expediente.tramite.cdenominaciontramite if expediente.tramite else None,
        "solicitante": {
            "nombre": " ".join(
                p for p in [solicitante.cnombres, solicitante.cpaterno, solicitante.cmaterno] if p
            )
            if solicitante
            else None,
            "correo": solicitante.ccorreo if solicitante else None,
        },
        "documentos": [
            {
                "id_documento": d.nidtdocumentoexpediente,
                "id_requisito": d.nidtrequisitotramite,
                "descripcion_requisito": (
                    requisitos[d.nidtrequisitotramite].cdescripcionrequisito
                    if d.nidtrequisitotramite in requisitos
                    else None
                ),
                "nombre_archivo": d.cnombrearchivooriginal,
                "url_visualizar": f"/api/admin/documentos/{d.nidtdocumentoexpediente}",
            }
            for d in documentos
        ],
        "voucher": {
            "numero": expediente.cnumerovoucher,
            "monto": float(expediente.nmontovoucher) if expediente.nmontovoucher is not None else None,
            "fecha_pago": expediente.dfechapagovoucher.isoformat()
            if expediente.dfechapagovoucher
            else None,
            "estado": expediente.cestadovoucher,
            "motivo_rechazo": expediente.cmotivorechazovoucher,
        },
        "historial": [
            {
                "estado_anterior": m.estado_anterior,
                "estado_nuevo": m.estado_nuevo,
                "comentario": m.comentario,
                "oficina_anterior": m.oficina_anterior,
                "oficina_nueva": m.oficina_nueva,
                "fecha_hora": m.fecha_hora.isoformat() if m.fecha_hora else None,
            }
            for m in movimientos
        ],
    }


def obtener_ruta_documento(id_documento: int, cidtusuario: str):
    documento = db.session.get(DocumentoExpediente, id_documento)
    if documento is None:
        return 404, {"error": "Documento no encontrado"}

    oficina = obtener_oficina_admin(cidtusuario)
    if oficina is None or documento.expediente.nidtoficinaactual != oficina:
        return 403, {"error": MENSAJE_NO_AUTORIZADO}

    try:
        contenido = storage_service.read(documento.crutaarchivo)
    except StorageError:
        return 502, {"error": "No se pudo recuperar el documento"}
    return contenido, documento.cnombrearchivooriginal, documento.cformatoarchivo


def tomar_decision(
    nro_expediente: str,
    cidtusuario: str,
    accion: str,
    comentario: str = None,
    motivo: str = None,
    id_requisito: int = None,
):
    expediente, error = _expediente_de_oficina(nro_expediente, cidtusuario)
    if error:
        return error

    if accion not in ACCION_A_ESTADO:
        return 400, {"error": "accion debe ser aprobar, observar o rechazar"}

    if accion == "observar":
        if not comentario or len(comentario.strip()) < 10:
            return 400, {
                "error": "El comentario de observacion es obligatorio (minimo 10 caracteres)"
            }
        if not id_requisito:
            return 400, {"error": "id_requisito es requerido al observar"}
        requisito = db.session.get(RequisitoTramite, id_requisito)
        if requisito is None or requisito.ccodigo != expediente.ccodigo:
            return 400, {"error": "El requisito no corresponde a este expediente"}
    elif accion == "rechazar":
        if not motivo or len(motivo.strip()) < 20:
            return 400, {"error": "El motivo de rechazo es obligatorio (minimo 20 caracteres)"}

    texto = comentario if accion == "observar" else motivo

    registrar_movimiento(
        nro_expediente,
        ACCION_A_ESTADO[accion],
        comentario=texto,
        usuario_responsable=cidtusuario,
        id_requisito_observado=id_requisito if accion == "observar" else None,
    )

    return 200, {"nro_expediente": nro_expediente, "estado": ACCION_A_ESTADO[accion]}


def validar_voucher(nro_expediente: str, cidtusuario: str, resultado: str, motivo: str = None):
    expediente, error = _expediente_de_oficina(nro_expediente, cidtusuario)
    if error:
        return error

    if expediente.cestadovoucher is None:
        return 400, {"error": "Este expediente no tiene un voucher registrado"}

    if resultado not in ("validado", "rechazado"):
        return 400, {"error": "resultado debe ser validado o rechazado"}

    if resultado == "rechazado":
        if not motivo:
            return 400, {"error": "El motivo de rechazo del voucher es obligatorio"}
        expediente.cestadovoucher = "RECHAZADO"
        expediente.cmotivorechazovoucher = motivo
        db.session.commit()
        notificar(
            expediente.cidtusuario,
            nro_expediente,
            f"Tu voucher de pago fue rechazado: {motivo}. Registra un nuevo voucher.",
        )
    else:
        expediente.cestadovoucher = "VALIDADO"
        expediente.cmotivorechazovoucher = None
        db.session.commit()
        notificar(
            expediente.cidtusuario, nro_expediente, "Tu voucher de pago fue validado correctamente."
        )

    return 200, {"nro_expediente": nro_expediente, "estado_voucher": expediente.cestadovoucher}


def obtener_oficinas_validas(nro_expediente: str, cidtusuario: str):
    expediente, error = _expediente_de_oficina(nro_expediente, cidtusuario)
    if error:
        return error

    flujos = FlujoDerivacion.query.filter_by(
        ccodigo=expediente.ccodigo, oficina_origen=expediente.nidtoficinaactual
    ).all()
    oficinas = [db.session.get(UnidadOrganizativa, f.oficina_destino) for f in flujos]

    return 200, {
        "oficinas": [
            {"id": o.nidtunidadorganizativa, "nombre": o.cnombreunidadorganizativa}
            for o in oficinas
            if o
        ]
    }


def derivar_expediente(nro_expediente: str, cidtusuario: str, oficina_destino: int, comentario: str):
    expediente, error = _expediente_de_oficina(nro_expediente, cidtusuario)
    if error:
        return error

    if not comentario or len(comentario.strip()) < 15:
        return 400, {"error": "El comentario de derivacion es obligatorio (minimo 15 caracteres)"}

    existe_flujo = FlujoDerivacion.query.filter_by(
        ccodigo=expediente.ccodigo,
        oficina_origen=expediente.nidtoficinaactual,
        oficina_destino=oficina_destino,
    ).first()
    if existe_flujo is None:
        return 400, {"error": "La oficina de destino no es valida para este tramite"}

    registrar_movimiento(
        nro_expediente,
        comentario=comentario,
        usuario_responsable=cidtusuario,
        oficina_nueva=oficina_destino,
    )

    return 200, {"nro_expediente": nro_expediente, "oficina_actual": oficina_destino}
