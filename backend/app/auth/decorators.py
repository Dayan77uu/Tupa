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


def requiere_rol_administrativo(f):
    """No existe el rol 'Personal Administrativo' literal en tperfil (los roles
    no-estudiante reales son USUARIO DE RECAUDACION, COORDINADOR DE TESORERIA,
    OPERADOR DE OTI, ADMINISTRADOR). Se trata cualquier rol distinto de
    ESTUDIANTE como personal administrativo para el panel del Sprint 4."""

    @wraps(f)
    def decorada(*args, **kwargs):
        if g.rol == "ESTUDIANTE" or not g.rol:
            return jsonify({"error": "No tiene permisos de personal administrativo"}), 403
        return f(*args, **kwargs)

    return decorada
