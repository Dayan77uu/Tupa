from flask import Blueprint, request, jsonify

from app.auth import service

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    correo = data.get("correo", "")
    contrasena = data.get("contrasena", "")
    ip = request.remote_addr or "desconocida"

    status_code, body = service.autenticar(correo, contrasena, ip)
    return jsonify(body), status_code


@auth_bp.post("/activar-cuenta")
def activar_cuenta():
    data = request.get_json(silent=True) or {}
    codigoalumno = data.get("codigoalumno", "")
    dni = data.get("dni", "")
    nueva_contrasena = data.get("nueva_contrasena", "")

    status_code, body = service.activar_cuenta(codigoalumno, dni, nueva_contrasena)
    return jsonify(body), status_code
