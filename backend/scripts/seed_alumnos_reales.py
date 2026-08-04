"""
Carga una nueva base de alumnos reales en talumno.

Reemplaza o extiende esta lista con los registros que necesites.
Uso: backend/venv/Scripts/python.exe -m scripts.seed_alumnos_reales
"""
from app import create_app
from app.extensions import db
from app.models.perfil_academico import Alumno

ALUMNOS_REALES = [
    {
        "codigoalumno": "215326",
        "dni": "60117277",
        "nombresalumno": "Alumno",
        "apalumno": "Realuno",
        "amalumno": "Prueba",
        "email": "60117277@unsaac.edu.pe",
        "codigoespecialidad": "001",
        "correo_institucional_generado": "60117277@unsaac.edu.pe",
    },
    {
        "codigoalumno": "225465",
        "dni": "74630347",
        "nombresalumno": "Alumno",
        "apalumno": "RealDos",
        "amalumno": "Prueba",
        "email": "74630347@unsaac.edu.pe",
        "codigoespecialidad": "002",
        "correo_institucional_generado": "74630347@unsaac.edu.pe",
    },
    {
        "codigoalumno": "235789",
        "dni": "70123456",
        "nombresalumno": "Aleatorio",
        "apalumno": "Alumno",
        "amalumno": "Prueba",
        "email": "70123456@unsaac.edu.pe",
        "codigoespecialidad": "003",
        "correo_institucional_generado": "70123456@unsaac.edu.pe",
    },
    {
        "codigoalumno": "245901",
        "dni": "70234567",
        "nombresalumno": "Aleatorio",
        "apalumno": "Alumno",
        "amalumno": "Demo",
        "email": "70234567@unsaac.edu.pe",
        "codigoespecialidad": "004",
        "correo_institucional_generado": "70234567@unsaac.edu.pe",
    },
    {
        "codigoalumno": "256012",
        "dni": "70345678",
        "nombresalumno": "Aleatorio",
        "apalumno": "Prueba",
        "amalumno": "Alumno",
        "email": "70345678@unsaac.edu.pe",
        "codigoespecialidad": "005",
        "correo_institucional_generado": "70345678@unsaac.edu.pe",
    },
]


def run():
    app = create_app()
    with app.app_context():
        print(f"Borrando talumno existente (filas actuales: {Alumno.query.count()})...")
        Alumno.query.delete(synchronize_session=False)
        db.session.flush()

        for datos in ALUMNOS_REALES:
            alumno = Alumno(**datos)
            db.session.add(alumno)

        db.session.commit()

        print(f"Insertados {len(ALUMNOS_REALES)} alumnos reales en talumno.")
        for alumno in ALUMNOS_REALES:
            print(f"- {alumno['codigoalumno']} / {alumno['dni']} / {alumno['nombresalumno']} {alumno['apalumno']}")


if __name__ == "__main__":
    run()
