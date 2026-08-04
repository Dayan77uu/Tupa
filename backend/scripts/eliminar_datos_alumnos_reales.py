"""
Elimina todos los datos de cuentas de alumno y vuelve a dejar talumno vacia.

Borra, en este orden (para respetar las FK):
1. tlogin de todas las cuentas de alumno (nidttipousuario=1).
2. tusuario de esas mismas cuentas.
3. Todas las filas de talumno.

NO se toca:
- El catalogo TUPA (tcatalogotramite, tflujoderivacion, etc.).
- La tabla tperfil ni los perfiles.
- Otras cuentas administrativas que no sean de alumno.

Uso: backend/venv/Scripts/python.exe -m scripts.eliminar_datos_alumnos_reales
"""

from app import create_app
from app.extensions import db
from app.models.usuario import Usuario, Login
from app.models.perfil_academico import Alumno


def run():
    app = create_app()
    with app.app_context():
        estudiantes = Usuario.query.filter(Usuario.nidttipousuario == 1).all()
        cidtusuarios_a_borrar = [u.cidtusuario for u in estudiantes]

        print(f"Cuentas de alumno identificadas para borrar: {len(cidtusuarios_a_borrar)}")

        logins_borrados = 0
        if cidtusuarios_a_borrar:
            logins_borrados = Login.query.filter(Login.cidtusuario.in_(cidtusuarios_a_borrar)).delete(
                synchronize_session=False
            )

        usuarios_borrados = Usuario.query.filter(Usuario.nidttipousuario == 1).delete(
            synchronize_session=False
        )

        total_talumno_antes = Alumno.query.count()
        alumnos_borrados = Alumno.query.delete(synchronize_session=False)

        db.session.commit()

        print(f"Filas tlogin borradas: {logins_borrados}")
        print(f"Filas tusuario borradas: {usuarios_borrados}")
        print(f"Filas talumno borradas: {alumnos_borrados} (de {total_talumno_antes} originales)")
        print("talumno queda vacia. No se tocaron cuentas administrativas fuera de alumnos.")


if __name__ == "__main__":
    run()
