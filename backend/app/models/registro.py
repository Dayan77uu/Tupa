from app.extensions import db


class UsuarioPendiente(db.Model):
    """Registro de alumno en espera de verificar su correo (Sprint 6). Unica
    via real para que un estudiante cree cuenta hoy, ya que talumno esta
    vacia -- no reemplaza activar-cuenta.html (se mantiene por si en el
    futuro aparece una fuente real de datos)."""

    __tablename__ = "tusuario_pendiente"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nombre = db.Column(db.String(150), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    token = db.Column(db.String(64), unique=True, nullable=False)
    token_expira = db.Column(db.DateTime, nullable=False)
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
