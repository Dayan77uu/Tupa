import os
from datetime import datetime

from sqlalchemy import text
from werkzeug.utils import secure_filename

from app.config import Config
from app.extensions import db
from app.models.usuario import Usuario
from app.models.tramite import CatalogoTramite, RequisitoTramite, UnidadTramite
from app.perfil_service import obtener_perfil_por_dni
from app.models.expediente import Expediente, DocumentoExpediente, ContadorExpediente
from app.models.movimiento import MovimientoExpediente
from app.seguimiento.service import registrar_movimiento
from app.dias_habiles import sumar_dias_habiles

MENSAJE_NO_AUTORIZADO = "No tiene acceso a este expediente"
MENSAJE_EXPEDIENTE_NO_ENCONTRADO = "Expediente no encontrado"


def obtener_perfil(cidtusuario: str):
    """Nombre y carrera se leen EXCLUSIVAMENTE via obtener_perfil_por_dni()
    (talumno real -> tperfildemo sintetico). Si el DNI no aparece en ninguna
    de las dos fuentes, se usa el nombre ya guardado en tusuario como ultimo
    respaldo (cuentas de prueba historicas de Sprint 1 que no tienen DNI en
    ninguna tabla academica)."""
    usuario = db.session.get(Usuario, cidtusuario)
    if usuario is None:
        return None

    perfil_academico = obtener_perfil_por_dni(usuario.cdni)
    nombre_respaldo = " ".join(
        parte for parte in [usuario.cnombres, usuario.cpaterno, usuario.cmaterno] if parte
    )

    return {
        "nombre": (perfil_academico["nombre"] if perfil_academico else None) or nombre_respaldo,
        "correo": usuario.ccorreo,
        "carrera": perfil_academico["carrera"] if perfil_academico else None,
        "facultad": None,
    }


def obtener_checklist(ccodigo: str):
    tramite = db.session.get(CatalogoTramite, ccodigo)
    if tramite is None or tramite.estado != "ACTIVO":
        return None

    requisitos = (
        RequisitoTramite.query.filter_by(ccodigo=ccodigo)
        .order_by(RequisitoTramite.nidtrequisitotramite)
        .all()
    )
    return [
        {
            "id_requisito": r.nidtrequisitotramite,
            "descripcion": r.cdescripcionrequisito,
            "obligatorio": bool(r.bobligatorio),
            "formatos_permitidos": r.cformatospermitidos.split(","),
            "tamano_max_mb": r.nmaxtamaniomb,
        }
        for r in requisitos
    ]


def _derivar_tipo_expediente(ccodigo: str) -> str:
    prefijo = (ccodigo or "")[:2].upper()
    return prefijo if prefijo.isalpha() else "GEN"


def _generar_numero_expediente(tipo: str) -> str:
    """Atomico via UPSERT: MySQL serializa INSERT ... ON DUPLICATE KEY UPDATE a nivel
    de fila, por lo que dos requests concurrentes no pueden obtener el mismo secuencial."""
    anio = datetime.utcnow().year

    db.session.execute(
        text(
            """
            INSERT INTO contador_expediente (anio, tipo, ultimo_numero)
            VALUES (:anio, :tipo, 1)
            ON DUPLICATE KEY UPDATE ultimo_numero = ultimo_numero + 1
            """
        ),
        {"anio": anio, "tipo": tipo},
    )
    contador = db.session.get(ContadorExpediente, (anio, tipo))
    secuencial = contador.ultimo_numero

    return f"{anio}-{tipo}-{secuencial:06d}"


def _oficina_inicial(ccodigo: str) -> int:
    """Oficina responsable real via tunidadtramite si existe; si no (la mayoria
    de tramites no la tienen cargada), SEDE CENTRAL CUSCO (id 1) por defecto."""
    fila = (
        db.session.query(UnidadTramite.nidtunidadorganizativa)
        .filter(UnidadTramite.ccodigo == ccodigo)
        .order_by(UnidadTramite.nidtunidadorganizativa.asc())
        .first()
    )
    return fila[0] if fila else 1


def registrar_solicitud(cidtusuario: str, ccodigo: str):
    """Devuelve (status_code, body_dict)."""
    tramite = db.session.get(CatalogoTramite, ccodigo)
    if tramite is None or tramite.estado != "ACTIVO":
        return 404, {"error": "El tramite no existe o no esta disponible"}

    tipo = _derivar_tipo_expediente(ccodigo)
    nro_expediente = _generar_numero_expediente(tipo)

    hoy = datetime.utcnow().date()
    vencimiento = sumar_dias_habiles(hoy, tramite.nplazodias) if tramite.nplazodias else None

    expediente = Expediente(
        cnroexpediente=nro_expediente,
        cidtusuario=cidtusuario,
        ccodigo=ccodigo,
        nidtoficinaactual=_oficina_inicial(ccodigo),
        cestado="BORRADOR",
        dfechavencimiento=vencimiento,
    )
    db.session.add(expediente)
    db.session.commit()

    return 201, {
        "nro_expediente": nro_expediente,
        "estado": expediente.cestado,
        "fecha_vencimiento": vencimiento.isoformat() if vencimiento else None,
    }


def _obtener_expediente_del_usuario(nro_expediente: str, cidtusuario: str):
    """Devuelve (expediente, error) — error es (status_code, body) o None."""
    expediente = Expediente.query.filter_by(cnroexpediente=nro_expediente).first()
    if expediente is None:
        return None, (404, {"error": MENSAJE_EXPEDIENTE_NO_ENCONTRADO})
    if expediente.cidtusuario != cidtusuario:
        return None, (403, {"error": MENSAJE_NO_AUTORIZADO})
    return expediente, None


def _estado_checklist_interno(expediente: Expediente):
    requisitos = RequisitoTramite.query.filter_by(ccodigo=expediente.ccodigo).all()
    documentos = {
        d.nidtrequisitotramite: d
        for d in DocumentoExpediente.query.filter_by(nidtexpediente=expediente.nidtexpediente).all()
    }

    items = []
    faltantes = []
    for r in requisitos:
        subido = r.nidtrequisitotramite in documentos
        items.append(
            {
                "id_requisito": r.nidtrequisitotramite,
                "descripcion": r.cdescripcionrequisito,
                "obligatorio": bool(r.bobligatorio),
                "subido": subido,
            }
        )
        if r.bobligatorio and not subido:
            faltantes.append(r.cdescripcionrequisito)

    return {"completo": len(faltantes) == 0, "requisitos": items, "faltantes": faltantes}


def obtener_estado_checklist(nro_expediente: str, cidtusuario: str):
    expediente, error = _obtener_expediente_del_usuario(nro_expediente, cidtusuario)
    if error:
        return error
    return 200, _estado_checklist_interno(expediente)


def _validar_y_guardar_documento(expediente: Expediente, id_requisito: int, archivo):
    """Devuelve (status_code, body) si hay un error de validacion, o None si
    el documento se guardo correctamente. Compartido por subir_documento
    (Sprint 2) y subsanar_documento (Sprint 3)."""
    requisito = db.session.get(RequisitoTramite, id_requisito)
    if requisito is None or requisito.ccodigo != expediente.ccodigo:
        return 400, {"error": "El requisito no corresponde a este expediente"}

    nombre_original = secure_filename(archivo.filename or "")
    if "." not in nombre_original:
        return 400, {"error": "El archivo no tiene una extension valida"}

    extension = nombre_original.rsplit(".", 1)[1].lower()
    formatos_permitidos = [f.strip().lower() for f in requisito.cformatospermitidos.split(",")]
    if extension not in formatos_permitidos:
        return 400, {
            "error": f"Formato no permitido. Formatos aceptados: {', '.join(formatos_permitidos)}"
        }

    archivo.seek(0, os.SEEK_END)
    tamano_bytes = archivo.tell()
    archivo.seek(0)
    limite_bytes = requisito.nmaxtamaniomb * 1024 * 1024
    if tamano_bytes > limite_bytes:
        return 400, {"error": f"El archivo supera el tamano maximo de {requisito.nmaxtamaniomb} MB"}

    carpeta_expediente = os.path.join(Config.UPLOAD_FOLDER, expediente.cnroexpediente)
    os.makedirs(carpeta_expediente, exist_ok=True)
    nombre_guardado = f"req{id_requisito}_{nombre_original}"
    ruta_absoluta = os.path.join(carpeta_expediente, nombre_guardado)
    archivo.save(ruta_absoluta)
    ruta_relativa = f"{expediente.cnroexpediente}/{nombre_guardado}"

    documento_existente = DocumentoExpediente.query.filter_by(
        nidtexpediente=expediente.nidtexpediente, nidtrequisitotramite=id_requisito
    ).first()
    if documento_existente:
        documento_existente.cnombrearchivooriginal = nombre_original
        documento_existente.crutaarchivo = ruta_relativa
        documento_existente.cformatoarchivo = extension
        documento_existente.ntamaniobytes = tamano_bytes
    else:
        db.session.add(
            DocumentoExpediente(
                nidtexpediente=expediente.nidtexpediente,
                nidtrequisitotramite=id_requisito,
                cnombrearchivooriginal=nombre_original,
                crutaarchivo=ruta_relativa,
                cformatoarchivo=extension,
                ntamaniobytes=tamano_bytes,
            )
        )
    db.session.commit()
    return None


def subir_documento(nro_expediente: str, cidtusuario: str, id_requisito: int, archivo):
    expediente, error = _obtener_expediente_del_usuario(nro_expediente, cidtusuario)
    if error:
        return error

    error = _validar_y_guardar_documento(expediente, id_requisito, archivo)
    if error:
        return error

    return 200, _estado_checklist_interno(expediente)


def registrar_voucher(nro_expediente: str, cidtusuario: str, numero_voucher: str, monto: float, fecha_pago: str):
    expediente, error = _obtener_expediente_del_usuario(nro_expediente, cidtusuario)
    if error:
        return error

    try:
        fecha_pago_parseada = datetime.strptime(fecha_pago, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return 400, {"error": "fecha_pago invalida, use formato AAAA-MM-DD"}

    expediente.cnumerovoucher = numero_voucher
    expediente.nmontovoucher = monto
    expediente.dfechapagovoucher = fecha_pago_parseada
    expediente.cestadovoucher = "PENDIENTE_VALIDACION"
    db.session.commit()

    return 200, {"nro_expediente": nro_expediente, "estado_voucher": expediente.cestadovoucher}


def confirmar_solicitud(nro_expediente: str, cidtusuario: str):
    expediente, error = _obtener_expediente_del_usuario(nro_expediente, cidtusuario)
    if error:
        return error

    estado_checklist = _estado_checklist_interno(expediente)
    if not estado_checklist["completo"]:
        return 400, {
            "error": "Faltan documentos obligatorios por subir",
            "faltantes": estado_checklist["faltantes"],
        }

    registrar_movimiento(
        nro_expediente, "PENDIENTE", comentario=None, usuario_responsable=cidtusuario
    )

    return 200, {"nro_expediente": nro_expediente, "estado": "PENDIENTE"}


def _obtener_ultima_observacion(nro_expediente: str):
    return (
        MovimientoExpediente.query.filter_by(
            nro_expediente=nro_expediente, estado_nuevo="OBSERVADO"
        )
        .order_by(MovimientoExpediente.fecha_hora.desc())
        .first()
    )


def obtener_observacion(nro_expediente: str, cidtusuario: str):
    expediente, error = _obtener_expediente_del_usuario(nro_expediente, cidtusuario)
    if error:
        return error

    if expediente.cestado != "OBSERVADO":
        return 400, {"error": "El expediente no esta en estado Observado"}

    movimiento = _obtener_ultima_observacion(nro_expediente)
    if movimiento is None:
        return 404, {"error": "No se encontro el detalle de la observacion"}

    requisito = (
        db.session.get(RequisitoTramite, movimiento.id_requisito_observado)
        if movimiento.id_requisito_observado
        else None
    )

    return 200, {
        "nro_expediente": nro_expediente,
        "id_requisito_observado": movimiento.id_requisito_observado,
        "descripcion_requisito": requisito.cdescripcionrequisito if requisito else None,
        "comentario": movimiento.comentario,
    }


def subsanar_documento(nro_expediente: str, cidtusuario: str, id_requisito: int, archivo):
    expediente, error = _obtener_expediente_del_usuario(nro_expediente, cidtusuario)
    if error:
        return error

    if expediente.cestado != "OBSERVADO":
        return 400, {"error": "Solo se puede subsanar un expediente en estado Observado"}

    movimiento = _obtener_ultima_observacion(nro_expediente)
    if movimiento is None or movimiento.id_requisito_observado is None:
        return 400, {"error": "No hay un requisito especifico observado para este expediente"}

    if id_requisito != movimiento.id_requisito_observado:
        return 400, {"error": "Solo puede reemplazar el documento que fue observado"}

    error = _validar_y_guardar_documento(expediente, id_requisito, archivo)
    if error:
        return error

    registrar_movimiento(
        nro_expediente,
        "EN_REVISION",
        comentario="El usuario subsano el documento observado.",
        usuario_responsable=cidtusuario,
    )

    return 200, {"nro_expediente": nro_expediente, "estado": "EN_REVISION"}
