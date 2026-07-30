"""
Elimina los datos de alumnos reales cargados en Sprint 6 (rama
fix/revision-datos-alumnos): el origen de `talumno` nunca tuvo un documento
que confirmara que es un extracto real de la UNSAAC (a diferencia del
catalogo TUPA, respaldado por la Resolucion Rectoral CU-520-2024-UNSAAC). El
equipo decidio no seguir usando esos datos hasta poder confirmarlo con el
docente.

Borra, en este orden (para respetar las FK):
1. tlogin de las cuentas de alumno real provisionadas (ver
   scripts/cargar_alumnos_reales.py): nidttipousuario=1, DNI de 8 digitos que
   existe en talumno.
2. tusuario de esas mismas cuentas.
3. Todas las filas de talumno.

NO se toca:
- El catalogo TUPA (tcatalogotramite, tflujoderivacion, etc.) -- viene de una
  fuente distinta y documentada (Resolucion CU-520-2024-UNSAAC).
- tperfildemo ni las cuentas sinteticas (estudiante demo 00000001, personal
  administrativo demo/prueba) -- no dependen de talumno.
- La columna talumno.correo_institucional_generado ni la migracion 006/007
  (se mantiene el codigo/infraestructura por si se recupera una fuente de
  datos confiable en el futuro).

Uso: backend/venv/Scripts/python.exe -m scripts.eliminar_datos_alumnos_reales
"""
import re

from app import create_app
from app.extensions import db
from app.models.usuario import Usuario, Login
from app.models.perfil_academico import Alumno

DNI_VALIDO = re.compile(r"^\d{8}$")


def run():
    app = create_app()
    with app.app_context():
        dnis_reales = {a.dni for a in Alumno.query.with_entities(Alumno.dni).all() if a.dni}

        candidatos = Usuario.query.filter(Usuario.nidttipousuario == 1).all()
        cidtusuarios_a_borrar = [
            u.cidtusuario
            for u in candidatos
            if u.cdni and DNI_VALIDO.match(u.cdni) and u.cdni in dnis_reales
        ]

        print(f"Cuentas de alumno real identificadas para borrar: {len(cidtusuarios_a_borrar)}")

        logins_borrados = Login.query.filter(Login.cidtusuario.in_(cidtusuarios_a_borrar)).delete(
            synchronize_session=False
        )
        usuarios_borrados = Usuario.query.filter(Usuario.cidtusuario.in_(cidtusuarios_a_borrar)).delete(
            synchronize_session=False
        )

        total_talumno_antes = Alumno.query.count()
        alumnos_borrados = Alumno.query.delete(synchronize_session=False)

        db.session.commit()

        print(f"Filas tlogin borradas: {logins_borrados}")
        print(f"Filas tusuario borradas: {usuarios_borrados}")
        print(f"Filas talumno borradas: {alumnos_borrados} (de {total_talumno_antes} originales)")
        print("talumno queda vacia. Catalogo TUPA y cuentas sinteticas no se tocaron.")


if __name__ == "__main__":
    run()
