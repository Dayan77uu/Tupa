from flask import Blueprint, jsonify, g

from app.auth.decorators import requiere_auth
from app.seguimiento import service

seguimiento_bp = Blueprint("seguimiento", __name__)


@seguimiento_bp.get("/mis-expedientes")
@requiere_auth
def mis_expedientes():
    return jsonify({"expedientes": service.obtener_mis_expedientes(g.id_usuario)}), 200


@seguimiento_bp.get("/expedientes/<nro_expediente>/historial")
@requiere_auth
def historial_expediente(nro_expediente):
    status_code, body = service.obtener_historial(nro_expediente, g.id_usuario)
    return jsonify(body), status_code
