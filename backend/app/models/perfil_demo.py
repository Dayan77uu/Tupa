from app.extensions import db


class PerfilDemo(db.Model):
    """Dataset sintetico de desarrollo/demo. NO representa personas reales de
    la UNSAAC. Pendiente de confirmacion del docente sobre el origen de
    bdtupa antes de integrar con datos reales de produccion. Ver
    app/perfil_service.py::obtener_perfil_por_dni()."""

    __tablename__ = "tperfildemo"

    dni = db.Column(db.String(10), primary_key=True)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    carrera = db.Column(db.String(150), nullable=True)
    correo = db.Column(db.String(100), nullable=False)
