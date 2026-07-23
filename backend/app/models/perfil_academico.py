from app.extensions import db


class Especialidad(db.Model):
    __tablename__ = "tespecialidad"

    ccodigoespecialidad = db.Column(db.String(3), primary_key=True)
    cnombreespecialidad = db.Column(db.String(100))


class Alumno(db.Model):
    """Tabla legada de matricula, sin FK declarada hacia tusuario. El vinculo real
    solo se puede intentar por DNI (cdni de tusuario == dni de talumno); no todos
    los tusuario tienen un talumno correspondiente (datos de prueba, por ejemplo)."""

    __tablename__ = "talumno"

    codigoalumno = db.Column(db.String(8), primary_key=True)
    dni = db.Column(db.String(10), nullable=False)
    nombresalumno = db.Column(db.String(50), nullable=True)
    apalumno = db.Column(db.String(50), nullable=True)
    amalumno = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    codigoespecialidad = db.Column(db.String(3), nullable=True)
    correo_institucional_generado = db.Column(db.String(100), nullable=True)
