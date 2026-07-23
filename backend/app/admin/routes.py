from flask import Blueprint, request, jsonify, g, send_file

from app.auth.decorators import requiere_auth, requiere_rol_administrativo
from app.admin import service

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/admin/bandeja")
@requiere_auth
@requiere_rol_administrativo
def bandeja():
    resultado = service.obtener_bandeja(g.id_usuario)
    if resultado is None:
        return jsonify({"error": "Su usuario no tiene una oficina asignada"}), 403
    return jsonify({"expedientes": resultado}), 200


@admin_bp.get("/admin/expedientes/<nro_expediente>")
@requiere_auth
@requiere_rol_administrativo
def detalle_expediente(nro_expediente):
    status_code, body = service.obtener_detalle(nro_expediente, g.id_usuario)
    return jsonify(body), status_code


@admin_bp.get("/admin/documentos/<int:id_documento>")
@requiere_auth
@requiere_rol_administrativo
def ver_documento(id_documento):
    resultado = service.obtener_ruta_documento(id_documento, g.id_usuario)
    if isinstance(resultado[0], int):
        status_code, body = resultado
        return jsonify(body), status_code

    ruta_absoluta, nombre_original = resultado
    return send_file(ruta_absoluta, as_attachment=False, download_name=nombre_original)


@admin_bp.post("/admin/expedientes/<nro_expediente>/decision")
@requiere_auth
@requiere_rol_administrativo
def decision_expediente(nro_expediente):
    data = request.get_json(silent=True) or {}
    status_code, body = service.tomar_decision(
        nro_expediente,
        g.id_usuario,
        data.get("accion"),
        comentario=data.get("comentario"),
        motivo=data.get("motivo"),
        id_requisito=data.get("id_requisito"),
    )
    return jsonify(body), status_code


@admin_bp.post("/admin/expedientes/<nro_expediente>/voucher/validar")
@requiere_auth
@requiere_rol_administrativo
def validar_voucher_expediente(nro_expediente):
    data = request.get_json(silent=True) or {}
    status_code, body = service.validar_voucher(
        nro_expediente, g.id_usuario, data.get("resultado"), motivo=data.get("motivo")
    )
    return jsonify(body), status_code


@admin_bp.get("/admin/expedientes/<nro_expediente>/oficinas-validas")
@requiere_auth
@requiere_rol_administrativo
def oficinas_validas(nro_expediente):
    status_code, body = service.obtener_oficinas_validas(nro_expediente, g.id_usuario)
    return jsonify(body), status_code


@admin_bp.post("/admin/expedientes/<nro_expediente>/derivar")
@requiere_auth
@requiere_rol_administrativo
def derivar_expediente(nro_expediente):
    data = request.get_json(silent=True) or {}
    status_code, body = service.derivar_expediente(
        nro_expediente, g.id_usuario, data.get("oficina_destino"), data.get("comentario")
    )
    return jsonify(body), status_code
