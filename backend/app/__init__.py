from flask import Flask, jsonify
from sqlalchemy import text
from werkzeug.middleware.proxy_fix import ProxyFix

from app.config import Config
from app.extensions import db
from flask import request


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    db.init_app(app)

    from flask_cors import CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    from app.auth.routes import auth_bp
    from app.catalogo.routes import catalogo_bp
    from app.solicitud.routes import solicitud_bp
    from app.seguimiento.routes import seguimiento_bp
    from app.notificaciones.routes import notificaciones_bp
    from app.dev.routes import dev_bp
    from app.admin.routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(catalogo_bp, url_prefix="/api/catalogo")
    app.register_blueprint(solicitud_bp, url_prefix="/api")
    app.register_blueprint(seguimiento_bp, url_prefix="/api")
    app.register_blueprint(notificaciones_bp, url_prefix="/api")
    app.register_blueprint(dev_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

    @app.get("/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            return jsonify({"status": "ok", "db": "connected"}), 200
        except Exception:
            return jsonify({"status": "error", "db": "disconnected"}), 500

    @app.errorhandler(413)
    def archivo_demasiado_grande(_error):
        return jsonify({"error": "El archivo supera el tamano maximo permitido"}), 413

    @app.after_request
    def _force_cors_headers(response):
        # Añade encabezados CORS por si la configuración automática no los aplica
        try:
            origin = request.headers.get("Origin")
            allowed = app.config.get("CORS_ORIGINS", [])
            if isinstance(allowed, str):
                allowed = [o.strip() for o in allowed.split(",") if o.strip()]
            if origin and ("*" in allowed or origin in allowed):
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                response.headers["Access-Control-Allow-Credentials"] = "true"
        except Exception:
            pass
        return response

    return app
