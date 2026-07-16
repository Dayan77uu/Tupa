from app.extensions import db


class UnidadOrganizativa(db.Model):
    __tablename__ = "tunidadorganizativa"

    nidtunidadorganizativa = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cnombreunidadorganizativa = db.Column(db.String(250))


class CatalogoTramite(db.Model):
    __tablename__ = "tcatalogotramite"

    ccodigo = db.Column(db.String(20), primary_key=True)
    cdenominaciontramite = db.Column(db.String(200))
    cdescripcion = db.Column(db.String(1000))
    ccodigobanco = db.Column(db.String(10))
    btienemontofijo = db.Column(db.Boolean)
    estado = db.Column(db.Enum("ACTIVO", "INACTIVO"), nullable=False, default="ACTIVO")
    nplazodias = db.Column(db.Integer, nullable=True)


class RequisitoTramite(db.Model):
    __tablename__ = "trequisitotramite"

    nidtrequisitotramite = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ccodigo = db.Column(db.String(20), db.ForeignKey("tcatalogotramite.ccodigo"), nullable=False)
    cdescripcionrequisito = db.Column(db.String(400))


class UnidadTramite(db.Model):
    __tablename__ = "tunidadtramite"

    ccodigo = db.Column(db.String(20), db.ForeignKey("tcatalogotramite.ccodigo"), primary_key=True)
    nidtunidadorganizativa = db.Column(
        db.Integer, db.ForeignKey("tunidadorganizativa.nidtunidadorganizativa"), primary_key=True
    )

    unidad = db.relationship("UnidadOrganizativa")


class MontoTramite(db.Model):
    __tablename__ = "tmontotramite"

    nidtmontotramite = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ccodigo = db.Column(db.String(20), db.ForeignKey("tcatalogotramite.ccodigo"), nullable=False)
    nmonto = db.Column(db.Numeric(10, 2))
    cdescripcionpago = db.Column(db.String(300))
    dfechainicio = db.Column(db.DateTime)
    dfechafin = db.Column(db.DateTime)
