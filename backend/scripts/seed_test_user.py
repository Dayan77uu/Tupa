"""
Crea datos minimos para poder probar CU-01/CU-02 en desarrollo:
- Perfil ESTUDIANTE en tperfil (no existia; los perfiles reales son todos de personal).
- Un usuario de prueba con correo @unsaac.edu.pe (los usuarios reales son de otra
  institucion y no pueden pasar la regla de dominio institucional).

Uso: backend/venv/Scripts/python.exe -m scripts.seed_test_user
"""
from app import create_app
from app.extensions import db, bcrypt
from app.models.usuario import Perfil, Usuario, Login
from sqlalchemy import text

TEST_CIDTUSUARIO = "99999999"
TEST_CORREO = "estudiante.prueba@unsaac.edu.pe"
TEST_PASSWORD = "Prueba123!"


def run():
    app = create_app()
    with app.app_context():
        db.session.execute(
            text(
                "INSERT INTO tconfiguracion (nidtconfiguracion, cdescripcion) "
                "VALUES (1, 'TIPO DE USUARIO') ON CONFLICT (nidtconfiguracion) DO NOTHING"
            )
        )
        db.session.execute(
            text(
                "INSERT INTO tdetalleconfiguracion "
                "(nidtdetalleconfiguracion, nidtconfiguracion, cdescripciondetalleconfiguracion) "
                "VALUES (1, 1, 'ESTUDIANTE') "
                "ON CONFLICT (nidtdetalleconfiguracion) DO NOTHING"
            )
        )

        perfil = Perfil.query.filter_by(cdescripcionperfil="ESTUDIANTE").first()
        if perfil is None:
            perfil = Perfil(cdescripcionperfil="ESTUDIANTE")
            db.session.add(perfil)
            db.session.flush()
            print(f"Perfil ESTUDIANTE creado (nidtperfil={perfil.nidtperfil})")
        else:
            print(f"Perfil ESTUDIANTE ya existia (nidtperfil={perfil.nidtperfil})")

        usuario = db.session.get(Usuario, TEST_CIDTUSUARIO)
        if usuario is None:
            usuario = Usuario(
                cidtusuario=TEST_CIDTUSUARIO,
                nidttipousuario=1,  # ESTUDIANTE, segun tdetalleconfiguracion
                cdni=TEST_CIDTUSUARIO,
                cnombres="Estudiante",
                cpaterno="Prueba",
                cmaterno="Sprint1",
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
            )
            db.session.add(login)
            print("Login de prueba creado")
        else:
            login.ccontrasenia = hash_contrasenia
            login.intentos_fallidos = 0
            login.fecha_bloqueo = None
            print("Login de prueba actualizado (password reseteada)")

        db.session.commit()
        print(f"\nListo. Credenciales de prueba: {TEST_CORREO} / {TEST_PASSWORD}")


if __name__ == "__main__":
    run()
