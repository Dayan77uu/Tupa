from app.extensions import db


class Notificacion(db.Model):
    __tablename__ = "tnotificacion"

    id_notificacion = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.String(10), db.ForeignKey("tusuario.cidtusuario"), nullable=False)
    nro_expediente = db.Column(
        db.String(20), db.ForeignKey("texpediente.cnroexpediente"), nullable=False
    )
    mensaje = db.Column(db.String(255), nullable=False)
    leida = db.Column(db.Boolean, nullable=False, default=False)
    fecha_hora = db.Column(db.DateTime, server_default=db.func.now())
