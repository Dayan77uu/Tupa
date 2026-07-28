from functools import wraps

import jwt
from flask import request, jsonify, g

from app.config import Config


def requiere_auth(f):
    @wraps(f)
    def decorada(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token no proporcionado"}), 401

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        g.id_usuario = payload.get("id_usuario")
        g.rol = payload.get("rol")

        return f(*args, **kwargs)

    return decorada


# Mapeo explicito de roles reales -> actores del Plan de Proyecto (Sprint 5, Fase C).
# No existe ningun valor real equivalente a "Jefe de Oficina" en tperfil - no se
# inventa uno. Los 5 valores reales son: ADMINISTRADOR, COORDINADOR DE TESORERIA,
# USUARIO DE RECAUDACION, OPERADOR DE OTI, ESTUDIANTE (confirmado, no hay mas).
ROLES_PERSONAL_ADMINISTRATIVO = {
    "USUARIO DE RECAUDACION",
    "COORDINADOR DE TESORERIA",
    "OPERADOR DE OTI",
}
ROLES_ADMINISTRADOR_SISTEMA = {"ADMINISTRADOR"}


def requiere_rol_administrativo(f):
    """Personal Administrativo = USUARIO DE RECAUDACION, COORDINADOR DE TESORERIA
    u OPERADOR DE OTI (mapeo explicito, Sprint 5). ANTES (Sprint 4) aceptaba
    'cualquier rol != ESTUDIANTE', lo que incluia por error a ADMINISTRADOR."""

    @wraps(f)
    def decorada(*args, **kwargs):
        if g.rol not in ROLES_PERSONAL_ADMINISTRATIVO:
            return jsonify({"error": "No tiene permisos de personal administrativo"}), 403
        return f(*args, **kwargs)

    return decorada


def requiere_rol_administrador_sistema(f):
    """Administrador del Sistema (CU-09): unicamente el rol ADMINISTRADOR."""

    @wraps(f)
    def decorada(*args, **kwargs):
        if g.rol not in ROLES_ADMINISTRADOR_SISTEMA:
            return jsonify({"error": "No tiene permisos de administrador del sistema"}), 403
        return f(*args, **kwargs)

    return decorada


def requiere_rol_gestion(f):
    """CU-08 (reportes): Personal Administrativo (su propia oficina, RN-24) o
    Administrador del Sistema (todo o filtra por oficina, RN-25)."""

    @wraps(f)
    def decorada(*args, **kwargs):
        if g.rol not in (ROLES_PERSONAL_ADMINISTRATIVO | ROLES_ADMINISTRADOR_SISTEMA):
            return jsonify({"error": "No tiene permisos para ver reportes"}), 403
        return f(*args, **kwargs)

    return decorada
