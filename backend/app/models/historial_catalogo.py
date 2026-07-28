from app.extensions import db


class HistorialCatalogo(db.Model):
    """Historial de versiones del catalogo (CU-09, RF14, RN-27, RN-29).
    Inmutable: no existe ningun endpoint de edicion ni borrado sobre esta tabla."""

    __tablename__ = "thistorialcatalogo"

    id_historial = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ccodigo = db.Column(db.String(20), db.ForeignKey("tcatalogotramite.ccodigo"), nullable=False)
    campo_modificado = db.Column(db.String(50), nullable=False)
    valor_anterior = db.Column(db.Text, nullable=True)
    valor_nuevo = db.Column(db.Text, nullable=True)
    usuario = db.Column(db.String(10), db.ForeignKey("tusuario.cidtusuario"), nullable=True)
    numero_resolucion = db.Column(db.String(50), nullable=False)
    fecha = db.Column(db.DateTime, server_default=db.func.now())
