from flask import Blueprint, request, jsonify, redirect
from urllib.parse import quote_plus

from app.auth import service

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    correo = data.get("correo", "")
    contrasena = data.get("contrasena", "")
    codigoalumno = data.get("codigoalumno", "")
    dni = data.get("dni", "")
    ip = request.remote_addr or "desconocida"

    status_code, body = service.autenticar(correo, contrasena, ip, codigoalumno, dni)
    return jsonify(body), status_code


@auth_bp.get("/verificar-email")
def verificar_email():
    token = request.args.get("token", "")
    status_code, body = service.verificar_email(token)
    redirect_url = f"{service.Config.FRONTEND_URL}/login.html?verified=1"
    if status_code != 200:
        mensaje = quote_plus(body.get("error", "Verificación fallida"))
        redirect_url = f"{service.Config.FRONTEND_URL}/login.html?verified=0&message={mensaje}"
    return redirect(redirect_url)

@auth_bp.post("/activar-cuenta")
def activar_cuenta():
    data = request.get_json(silent=True) or {}
    codigoalumno = data.get("codigoalumno", "")
    dni = data.get("dni", "")
    nueva_contrasena = data.get("nueva_contrasena", "")
    ip = request.remote_addr or "desconocida"

    status_code, body = service.activar_cuenta(codigoalumno, dni, nueva_contrasena, ip)
    return jsonify(body), status_code


