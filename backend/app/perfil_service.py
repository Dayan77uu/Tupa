"""Punto UNICO de lectura de nombre/carrera de un estudiante por DNI en todo
el sistema. Ningun otro modulo debe consultar talumno o tperfildemo
directamente - siempre via obtener_perfil_por_dni().

talumno se consulta de forma exclusivamente READ-ONLY (nunca se le inserta
ni actualiza nada desde este proyecto): son 4,522 alumnos reales de la
UNSAAC, pero ninguno tiene correo @unsaac.edu.pe, asi que no sirven para
loguearse tal cual estan. tperfildemo es el fallback: dataset sintetico
propio del proyecto (ver migracion 005) para desarrollo/demo, hasta que el
docente confirme el origen real de bdtupa.
"""
from app.models.perfil_academico import Alumno, Especialidad
from app.models.perfil_demo import PerfilDemo
from app.extensions import db


def obtener_perfil_por_dni(dni: str):
    """Devuelve {"nombre": str, "carrera": str|None, "correo": str|None,
    "fuente": "talumno"|"tperfildemo"} o None si no se encuentra en ninguna
    de las dos fuentes."""
    if not dni:
        return None

    alumno = Alumno.query.filter_by(dni=dni).first()
    if alumno is not None:
        especialidad = (
            db.session.get(Especialidad, alumno.codigoespecialidad)
            if alumno.codigoespecialidad
            else None
        )
        nombre = " ".join(
            p for p in [alumno.nombresalumno, alumno.apalumno, alumno.amalumno] if p
        )
        return {
            "nombre": nombre or None,
            "carrera": especialidad.cnombreespecialidad if especialidad else None,
            "correo": alumno.email,  # ADVERTENCIA: correo personal real (Gmail/Hotmail), no institucional
            "fuente": "talumno",
        }

    demo = db.session.get(PerfilDemo, dni)
    if demo is not None:
        return {
            "nombre": f"{demo.nombres} {demo.apellidos}",
            "carrera": demo.carrera,
            "correo": demo.correo,
            "fuente": "tperfildemo",
        }

    return None
