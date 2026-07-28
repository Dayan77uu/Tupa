from app.extensions import db


class ContadorExpediente(db.Model):
    __tablename__ = "contador_expediente"

    anio = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(10), primary_key=True)
    ultimo_numero = db.Column(db.Integer, nullable=False, default=0)


class Expediente(db.Model):
    __tablename__ = "texpediente"

    nidtexpediente = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cnroexpediente = db.Column(db.String(20), unique=True, nullable=False)
    cidtusuario = db.Column(db.String(10), db.ForeignKey("tusuario.cidtusuario"), nullable=False)
    ccodigo = db.Column(db.String(20), db.ForeignKey("tcatalogotramite.ccodigo"), nullable=False)
    nidtoficinaactual = db.Column(
        db.Integer, db.ForeignKey("tunidadorganizativa.nidtunidadorganizativa"), nullable=False
    )
    cestado = db.Column(
        db.Enum("BORRADOR", "PENDIENTE", "EN_REVISION", "OBSERVADO", "APROBADO", "RECHAZADO"),
        nullable=False,
        default="BORRADOR",
    )
    dfecharegistro = db.Column(db.DateTime, server_default=db.func.now())
    dfechavencimiento = db.Column(db.Date, nullable=True)
    cnumerovoucher = db.Column(db.String(20), nullable=True)
    nmontovoucher = db.Column(db.Numeric(10, 2), nullable=True)
    dfechapagovoucher = db.Column(db.Date, nullable=True)
    cestadovoucher = db.Column(
        db.Enum("PENDIENTE_VALIDACION", "VALIDADO", "RECHAZADO"), nullable=True
    )
    cmotivorechazovoucher = db.Column(db.String(255), nullable=True)

    tramite = db.relationship("CatalogoTramite")
    documentos = db.relationship("DocumentoExpediente", backref="expediente")
    oficina = db.relationship("UnidadOrganizativa")


class DocumentoExpediente(db.Model):
    __tablename__ = "tdocumentoexpediente"

    nidtdocumentoexpediente = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nidtexpediente = db.Column(db.Integer, db.ForeignKey("texpediente.nidtexpediente"), nullable=False)
    nidtrequisitotramite = db.Column(
        db.Integer, db.ForeignKey("trequisitotramite.nidtrequisitotramite"), nullable=False
    )
    cnombrearchivooriginal = db.Column(db.String(255), nullable=False)
    crutaarchivo = db.Column(db.String(255), nullable=False)
    cformatoarchivo = db.Column(db.String(10), nullable=False)
    ntamaniobytes = db.Column(db.Integer, nullable=False)
    dfechasubida = db.Column(db.DateTime, server_default=db.func.now())
