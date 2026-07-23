from flask import Blueprint, jsonify, g

from app.auth.decorators import requiere_auth
from app.notificaciones import service

notificaciones_bp = Blueprint("notificaciones", __name__)


@notificaciones_bp.get("/notificaciones")
@requiere_auth
def listar_notificaciones():
    return jsonify(service.obtener_notificaciones(g.id_usuario)), 200


@notificaciones_bp.post("/notificaciones/<int:id_notificacion>/leer")
@requiere_auth
def marcar_notificacion_leida(id_notificacion):
    status_code, body = service.marcar_leida(id_notificacion, g.id_usuario)
    return jsonify(body), status_code
