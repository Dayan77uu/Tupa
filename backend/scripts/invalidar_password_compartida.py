"""
Correccion de seguridad urgente (Sprint 6): invalida la contrasena compartida
en texto plano que se uso para crear las cuentas de login de 2,306 alumnos
reales (ver scripts/cargar_alumnos_reales.py, ya corregido) y que quedo
expuesta en un commit ya pusheado a un repositorio publico.

Reemplaza el hash de ccontrasenia por el hash de un secreto aleatorio
generado por cuenta (secrets.token_urlsafe) que se descarta inmediatamente
despues de hashearlo -- nunca se imprime, guarda ni loguea en ningun lado.
Marca la cuenta como `activada = False` (pendiente de activacion via
POST /api/auth/activar-cuenta).

Selecciona exactamente las cuentas creadas por cargar_alumnos_reales.py:
tusuario.nidttipousuario = 1 (estudiante) cuyo cdni (8 digitos validos)
tiene un talumno.dni correspondiente. Los 5 estudiantes demo (tperfildemo,
DNI 00000001-00000005) NO tienen fila en talumno, asi que no entran en este
filtro -- se verifico antes de correr este script.

Uso: backend/venv/Scripts/python.exe -m scripts.invalidar_password_compartida
"""
import secrets

from sqlalchemy import exists

from app import create_app
from app.extensions import db, bcrypt
from app.models.usuario import Usuario, Login
from app.models.perfil_academico import Alumno


def run():
    app = create_app()
    with app.app_context():
        objetivo = (
            db.session.query(Usuario.cidtusuario)
            .filter(
                Usuario.nidttipousuario == 1,
                Usuario.cdni.op("REGEXP")(r"^[0-9]{8}$"),
                exists().where(Alumno.dni == Usuario.cdni),
            )
            .all()
        )
        ids_objetivo = [row[0] for row in objetivo]
        print(f"Cuentas identificadas para invalidar: {len(ids_objetivo)}")

        invalidadas = 0
        no_encontradas = 0

        for cidtusuario in ids_objetivo:
            login = Login.query.filter_by(cidtusuario=cidtusuario).first()
            if login is None:
                no_encontradas += 1
                continue

            secreto_descartable = secrets.token_urlsafe(32)
            login.ccontrasenia = bcrypt.generate_password_hash(secreto_descartable, rounds=12).decode("utf-8")
            del secreto_descartable

            login.activada = False
            login.intentos_fallidos = 0
            login.fecha_bloqueo = None
            invalidadas += 1

        db.session.commit()

        print(f"Cuentas invalidadas (hash reemplazado, activada=False): {invalidadas}")
        print(f"Cuentas objetivo sin fila tlogin encontrada (inesperado): {no_encontradas}")


if __name__ == "__main__":
    run()
