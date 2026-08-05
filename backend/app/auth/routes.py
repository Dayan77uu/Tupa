from flask import Blueprint, request, jsonify, redirect
from urllib.parse import quote_plus

from app.auth import service

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    identificador = data.get("codigo_alumno") or data.get("correo") or data.get("identificador") or ""
    contrasena = data.get("password") or data.get("contrasena") or ""
    ip = request.remote_addr or "desconocida"

    status_code, body = service.iniciar_sesion(identificador, contrasena, ip)
    return jsonify(body), status_code


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    codigo_alumno = data.get("codigo_alumno", "")
    dni = data.get("dni", "")
    password = data.get("password", "")
    password_confirmation = data.get("password_confirmation", "")
    ip = request.remote_addr or "desconocida"

    status_code, body = service.registrar_alumno(codigo_alumno, dni, password, password_confirmation, ip)
    return jsonify(body), status_code


@auth_bp.post("/resend-verification")
def resend_verification():
    data = request.get_json(silent=True) or {}
    codigo_alumno = data.get("codigo_alumno", "")
    ip = request.remote_addr or "desconocida"

    status_code, body = service.reenviar_verificacion(codigo_alumno, ip)
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
