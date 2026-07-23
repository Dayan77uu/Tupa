"""
Crea un usuario de prueba con rol de personal administrativo para el Sprint 4.

Los usuarios administrativos reales (24007146, 44760467, OTI_TESO) no tienen
correo @unsaac.edu.pe (son de otra institucion, igual que el caso de
seed_test_user.py), asi que no pueden pasar la regla de dominio institucional
del login. Este script crea uno nuevo que si puede loguearse, con el rol
OPERADOR DE OTI (perfil ya existente en tperfil) y asignado a la oficina
SEDE CENTRAL CUSCO (id 1).

Uso: backend/venv/Scripts/python.exe -m scripts.seed_test_admin
"""
from app import create_app
from app.extensions import db, bcrypt
from app.models.usuario import Perfil, Usuario, Login

TEST_CIDTUSUARIO = "88888888"
TEST_CORREO = "administrativo.prueba@unsaac.edu.pe"
TEST_PASSWORD = "Prueba123!"
TEST_OFICINA = 1  # SEDE CENTRAL CUSCO


def run():
    app = create_app()
    with app.app_context():
        perfil = Perfil.query.filter_by(cdescripcionperfil="OPERADOR DE OTI").first()
        if perfil is None:
            print("ERROR: no existe el perfil 'OPERADOR DE OTI' en tperfil.")
            return

        usuario = db.session.get(Usuario, TEST_CIDTUSUARIO)
        if usuario is None:
            usuario = Usuario(
                cidtusuario=TEST_CIDTUSUARIO,
                nidttipousuario=3,  # ADMINISTRATIVO, segun tdetalleconfiguracion
                cdni=TEST_CIDTUSUARIO,
                cnombres="Administrativo",
                cpaterno="Prueba",
                cmaterno="Sprint4",
                ccorreo=TEST_CORREO,
            )
            db.session.add(usuario)
            print(f"Usuario de prueba creado ({TEST_CORREO})")
        else:
            print("Usuario de prueba ya existia")

        login = Login.query.filter_by(cidtusuario=TEST_CIDTUSUARIO).first()
        hash_contrasenia = bcrypt.generate_password_hash(TEST_PASSWORD, rounds=12).decode("utf-8")
        if login is None:
            login = Login(
                clogin=TEST_CIDTUSUARIO,
                cidtusuario=TEST_CIDTUSUARIO,
                nidtperfil=perfil.nidtperfil,
                ccontrasenia=hash_contrasenia,
                intentos_fallidos=0,
                nidtunidadorganizativa=TEST_OFICINA,
            )
            db.session.add(login)
            print("Login de prueba creado")
        else:
            login.ccontrasenia = hash_contrasenia
            login.intentos_fallidos = 0
            login.fecha_bloqueo = None
            login.nidtunidadorganizativa = TEST_OFICINA
            print("Login de prueba actualizado (password reseteada)")

        db.session.commit()
        print(f"\nListo. Credenciales de prueba: {TEST_CORREO} / {TEST_PASSWORD}")
        print(f"Rol: OPERADOR DE OTI, oficina: SEDE CENTRAL CUSCO (id {TEST_OFICINA})")


if __name__ == "__main__":
    run()
