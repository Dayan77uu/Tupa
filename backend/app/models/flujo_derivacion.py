from app.extensions import db


class FlujoDerivacion(db.Model):
    """Oficinas de destino validas para derivar un expediente de un tramite dado.

    Tabla vacia por diseno (Sprint 4): no existe en la BD real ninguna fuente de
    este flujo. Contiene una unica fila de PRUEBA (ver migracion 004) hasta que
    se cargue el flujo real del TUPA."""

    __tablename__ = "tflujoderivacion"

    id_flujo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ccodigo = db.Column(db.String(20), db.ForeignKey("tcatalogotramite.ccodigo"), nullable=False)
    oficina_origen = db.Column(
        db.Integer, db.ForeignKey("tunidadorganizativa.nidtunidadorganizativa"), nullable=False
    )
    oficina_destino = db.Column(
        db.Integer, db.ForeignKey("tunidadorganizativa.nidtunidadorganizativa"), nullable=False
    )
