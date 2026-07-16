from app.extensions import db


class Perfil(db.Model):
    __tablename__ = "tperfil"

    nidtperfil = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cdescripcionperfil = db.Column(db.String(100))


class Usuario(db.Model):
    __tablename__ = "tusuario"

    cidtusuario = db.Column(db.String(10), primary_key=True)
    nidttipousuario = db.Column(db.Integer)
    cdni = db.Column(db.String(10))
    ccodigo = db.Column(db.String(20))
    cnombres = db.Column(db.String(45))
    cpaterno = db.Column(db.String(45))
    cmaterno = db.Column(db.String(45))
    ccorreo = db.Column(db.String(45))
    dfechanacimiento = db.Column(db.DateTime)
    ctelefono = db.Column(db.String(20))


class Login(db.Model):
    __tablename__ = "tlogin"

    clogin = db.Column(db.String(20), primary_key=True)
    cidtusuario = db.Column(db.String(10), db.ForeignKey("tusuario.cidtusuario"), nullable=False)
    nidtperfil = db.Column(db.Integer, db.ForeignKey("tperfil.nidtperfil"), nullable=False)
    dfechainicio = db.Column(db.DateTime)
    dfechafin = db.Column(db.DateTime)
    ccontrasenia = db.Column(db.String(200))
    intentos_fallidos = db.Column(db.Integer, nullable=False, default=0)
    fecha_bloqueo = db.Column(db.DateTime, nullable=True)

    usuario = db.relationship("Usuario", backref="logins")
    perfil = db.relationship("Perfil")


class RegistroAuditoria(db.Model):
    __tablename__ = "registro_auditoria"

    id_registro = db.Column(db.Integer, primary_key=True, autoincrement=True)
    correo_ingresado = db.Column(db.String(120), nullable=True)
    direccion_ip = db.Column(db.String(45), nullable=False)
    resultado = db.Column(db.Enum("EXITOSO", "FALLIDO", "ERROR_SISTEMA"), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
