from flask import Flask, jsonify
from sqlalchemy import text

from app.config import Config
from app.extensions import db, bcrypt, mail


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    from flask_cors import CORS
    CORS(app, origins=["http://localhost:5173"])

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

    return app
