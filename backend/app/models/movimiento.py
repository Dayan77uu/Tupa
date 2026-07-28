from app.extensions import db

ESTADOS_COLOR = {
    "BORRADOR": "gris",
    "PENDIENTE": "gris",
    "EN_REVISION": "azul",
    "OBSERVADO": "naranja",
    "APROBADO": "verde",
    "RECHAZADO": "rojo",
}


class MovimientoExpediente(db.Model):
    __tablename__ = "tmovimientoexpediente"

    id_movimiento = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nro_expediente = db.Column(
        db.String(20), db.ForeignKey("texpediente.cnroexpediente"), nullable=False
    )
    estado_anterior = db.Column(db.String(20), nullable=True)
    estado_nuevo = db.Column(db.String(20), nullable=False)
    comentario = db.Column(db.Text, nullable=True)
    id_requisito_observado = db.Column(
        db.Integer, db.ForeignKey("trequisitotramite.nidtrequisitotramite"), nullable=True
    )
    usuario_responsable = db.Column(
        db.String(10), db.ForeignKey("tusuario.cidtusuario"), nullable=True
    )
    oficina_anterior = db.Column(
        db.Integer, db.ForeignKey("tunidadorganizativa.nidtunidadorganizativa"), nullable=True
    )
    oficina_nueva = db.Column(
        db.Integer, db.ForeignKey("tunidadorganizativa.nidtunidadorganizativa"), nullable=True
    )
    fecha_hora = db.Column(db.DateTime, server_default=db.func.now())
