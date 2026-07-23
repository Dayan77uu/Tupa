"""
Cuentas de login para alumnos reales de talumno (Fase 1, Sprint 6).

Autorizacion del docente (23/07/2026): modificar bdtupa con criterio del equipo
para que el sistema funcione al 100%. Ver migracion 006 (correo_institucional_generado).

Solo se crea cuenta (tusuario + tlogin) para alumnos con DNI valido (8 digitos):
de los 4,522 registros de talumno, 2,080 no tienen DNI (no hay como identificarlos
en tusuario.cdni) y 11 tienen un DNI que no son 8 digitos -- ambos casos quedan SIN
cuenta de login, documentado aqui, no inventado.

123 DNIs se repiten entre 2-3 filas de talumno (misma persona, varios codigoalumno -
reingreso o doble carrera). Se usa el codigoalumno mas alto (mas reciente) de cada
DNI para la cuenta unica de esa persona.

Password compartida de prueba para los 2,3xx alumnos reales (NO es su password real,
UNSAAC no expone ese dato -- ver mismo criterio que seed_dataset_sintetico.py).

Uso: backend/venv/Scripts/python.exe -m scripts.cargar_alumnos_reales
"""
import re

from app import create_app
from app.extensions import db, bcrypt
from app.models.usuario import Perfil, Usuario, Login
from app.models.perfil_academico import Alumno

PASSWORD_ALUMNOS_REALES = "Estudiante123!"
DNI_VALIDO = re.compile(r"^\d{8}$")


def run():
    app = create_app()
    with app.app_context():
        perfil_estudiante = Perfil.query.filter_by(cdescripcionperfil="ESTUDIANTE").first()
        if perfil_estudiante is None:
            print("ERROR: no existe el perfil ESTUDIANTE en tperfil.")
            return

        hash_password = bcrypt.generate_password_hash(PASSWORD_ALUMNOS_REALES, rounds=12).decode("utf-8")

        alumnos = Alumno.query.all()

        mejor_por_dni = {}
        sin_dni = 0
        dni_invalido = 0
        for alumno in alumnos:
            dni = (alumno.dni or "").strip()
            if not dni:
                sin_dni += 1
                continue
            if not DNI_VALIDO.match(dni):
                dni_invalido += 1
                continue
            actual = mejor_por_dni.get(dni)
            if actual is None or alumno.codigoalumno > actual.codigoalumno:
                mejor_por_dni[dni] = alumno

        existentes = {u.cidtusuario for u in Usuario.query.with_entities(Usuario.cidtusuario).all()}

        creados = 0
        ya_existian = 0
        for dni, alumno in mejor_por_dni.items():
            if dni in existentes:
                ya_existian += 1
                continue

            db.session.add(
                Usuario(
                    cidtusuario=dni,
                    nidttipousuario=1,
                    cdni=dni,
                    ccodigo=alumno.codigoalumno,
                    cnombres=alumno.nombresalumno,
                    cpaterno=alumno.apalumno,
                    cmaterno=alumno.amalumno,
                    ccorreo=alumno.correo_institucional_generado,
                )
            )
            db.session.add(
                Login(
                    clogin=dni,
                    cidtusuario=dni,
                    nidtperfil=perfil_estudiante.nidtperfil,
                    ccontrasenia=hash_password,
                    intentos_fallidos=0,
                    nidtunidadorganizativa=None,
                )
            )
            creados += 1

        db.session.commit()

        print(f"Total filas en talumno: {len(alumnos)}")
        print(f"Sin DNI (sin cuenta posible): {sin_dni}")
        print(f"DNI con formato invalido (sin cuenta posible): {dni_invalido}")
        print(f"DNIs unicos validos: {len(mejor_por_dni)}")
        print(f"Cuentas ya existian: {ya_existian}")
        print(f"Cuentas creadas: {creados}")
        print(f"Password para todas las cuentas de alumno real: {PASSWORD_ALUMNOS_REALES}")


if __name__ == "__main__":
    run()
