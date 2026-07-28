from flask import Blueprint, request, jsonify, g

from app.auth.decorators import requiere_auth
from app.solicitud import service

solicitud_bp = Blueprint("solicitud", __name__)


@solicitud_bp.get("/mi-perfil")
@requiere_auth
def mi_perfil():
    perfil = service.obtener_perfil(g.id_usuario)
    if perfil is None:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(perfil), 200


@solicitud_bp.get("/tramites/<ccodigo>/checklist")
@requiere_auth
def checklist_tramite(ccodigo):
    checklist = service.obtener_checklist(ccodigo)
    if checklist is None:
        return jsonify({"error": "Tramite no encontrado"}), 404
    return jsonify({"requisitos": checklist}), 200


@solicitud_bp.post("/solicitudes")
@requiere_auth
def crear_solicitud():
    data = request.get_json(silent=True) or {}
    ccodigo = data.get("id_tramite") or data.get("ccodigo")
    if not ccodigo:
        return jsonify({"error": "id_tramite es requerido"}), 400

    status_code, body = service.registrar_solicitud(g.id_usuario, ccodigo)
    return jsonify(body), status_code


@solicitud_bp.get("/solicitudes/<nro_expediente>/estado-checklist")
@requiere_auth
def estado_checklist(nro_expediente):
    status_code, body = service.obtener_estado_checklist(nro_expediente, g.id_usuario)
    return jsonify(body), status_code


@solicitud_bp.post("/solicitudes/<nro_expediente>/documentos")
@requiere_auth
def subir_documento(nro_expediente):
    id_requisito = request.form.get("id_requisito", type=int)
    archivo = request.files.get("archivo")

    if not id_requisito or archivo is None:
        return jsonify({"error": "id_requisito y archivo son requeridos"}), 400

    status_code, body = service.subir_documento(nro_expediente, g.id_usuario, id_requisito, archivo)
    return jsonify(body), status_code


@solicitud_bp.post("/solicitudes/<nro_expediente>/voucher")
@requiere_auth
def registrar_voucher(nro_expediente):
    data = request.get_json(silent=True) or {}
    numero_voucher = data.get("numero_voucher")
    monto = data.get("monto")
    fecha_pago = data.get("fecha_pago")

    if not numero_voucher or monto is None or not fecha_pago:
        return jsonify({"error": "numero_voucher, monto y fecha_pago son requeridos"}), 400

    status_code, body = service.registrar_voucher(
        nro_expediente, g.id_usuario, numero_voucher, monto, fecha_pago
    )
    return jsonify(body), status_code


@solicitud_bp.post("/solicitudes/<nro_expediente>/confirmar")
@requiere_auth
def confirmar_solicitud(nro_expediente):
    status_code, body = service.confirmar_solicitud(nro_expediente, g.id_usuario)
    return jsonify(body), status_code


@solicitud_bp.get("/expedientes/<nro_expediente>/observacion")
@requiere_auth
def observacion_expediente(nro_expediente):
    status_code, body = service.obtener_observacion(nro_expediente, g.id_usuario)
    return jsonify(body), status_code


@solicitud_bp.post("/expedientes/<nro_expediente>/subsanar")
@requiere_auth
def subsanar_expediente(nro_expediente):
    id_requisito = request.form.get("id_requisito", type=int)
    archivo = request.files.get("archivo")

    if not id_requisito or archivo is None:
        return jsonify({"error": "id_requisito y archivo son requeridos"}), 400

    status_code, body = service.subsanar_documento(nro_expediente, g.id_usuario, id_requisito, archivo)
    return jsonify(body), status_code
