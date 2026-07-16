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
