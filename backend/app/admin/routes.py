from io import BytesIO

from flask import Blueprint, request, jsonify, g, send_file

from app.auth.decorators import (
    requiere_auth,
    requiere_rol_administrativo,
    requiere_rol_administrador_sistema,
    requiere_rol_gestion,
)
from app.admin import service, catalogo_service, usuarios_service, reportes_service, exportar_service

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

    contenido, nombre_original, formato = resultado
    mimetype = {
        "pdf": "application/pdf",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
    }.get(formato, "application/octet-stream")
    return send_file(
        BytesIO(contenido),
        as_attachment=False,
        download_name=nombre_original,
        mimetype=mimetype,
    )


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


# ==========================================================================
# CU-09 — Gestion del catalogo TUPA (solo Administrador del Sistema)
# ==========================================================================


@admin_bp.get("/admin/catalogo")
@requiere_auth
@requiere_rol_administrador_sistema
def listar_catalogo():
    return jsonify({"tramites": catalogo_service.listar_catalogo()}), 200


@admin_bp.put("/admin/catalogo/<ccodigo>")
@requiere_auth
@requiere_rol_administrador_sistema
def actualizar_catalogo(ccodigo):
    data = request.get_json(silent=True) or {}
    status_code, body = catalogo_service.actualizar_tramite(ccodigo, g.id_usuario, data)
    return jsonify(body), status_code


@admin_bp.patch("/admin/catalogo/<ccodigo>/estado")
@requiere_auth
@requiere_rol_administrador_sistema
def cambiar_estado_catalogo(ccodigo):
    data = request.get_json(silent=True) or {}
    status_code, body = catalogo_service.cambiar_estado(
        ccodigo, g.id_usuario, data.get("estado"), data.get("numero_resolucion_rectoral")
    )
    return jsonify(body), status_code


@admin_bp.get("/admin/catalogo/<ccodigo>/historial")
@requiere_auth
@requiere_rol_administrador_sistema
def historial_catalogo(ccodigo):
    status_code, body = catalogo_service.obtener_historial(ccodigo)
    return jsonify(body), status_code


# ==========================================================================
# CU-09 — Gestion de usuarios (solo Administrador del Sistema)
# ==========================================================================


@admin_bp.post("/admin/usuarios")
@requiere_auth
@requiere_rol_administrador_sistema
def crear_usuario():
    data = request.get_json(silent=True) or {}
    status_code, body = usuarios_service.crear_usuario(data)
    return jsonify(body), status_code


# ==========================================================================
# CU-08 — Reportes de desempeno (Personal Administrativo u Administrador)
# ==========================================================================


@admin_bp.get("/reportes")
@requiere_auth
@requiere_rol_gestion
def reportes():
    status_code, body = reportes_service.generar_reporte(
        g.id_usuario,
        g.rol,
        request.args.get("periodo"),
        request.args.get("estado"),
        request.args.get("fecha_desde"),
        request.args.get("fecha_hasta"),
        request.args.get("oficina"),
    )
    return jsonify(body), status_code


@admin_bp.get("/reportes/exportar")
@requiere_auth
@requiere_rol_gestion
def exportar_reporte():
    formato = request.args.get("formato", "pdf")
    status_code, body = reportes_service.generar_reporte(
        g.id_usuario,
        g.rol,
        request.args.get("periodo"),
        request.args.get("estado"),
        request.args.get("fecha_desde"),
        request.args.get("fecha_hasta"),
        request.args.get("oficina"),
    )

    if status_code != 200:
        return jsonify(body), status_code
    if body.get("sin_datos"):
        return jsonify(body), 200

    if formato == "excel":
        buffer = exportar_service.exportar_excel(body, g.id_usuario)
        return send_file(
            buffer,
            as_attachment=True,
            download_name="reporte_tupa.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    buffer = exportar_service.exportar_pdf(body, g.id_usuario)
    return send_file(buffer, as_attachment=True, download_name="reporte_tupa.pdf", mimetype="application/pdf")
