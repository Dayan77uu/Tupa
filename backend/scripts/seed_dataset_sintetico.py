"""
Dataset sintetico para desarrollo/demo (Sprint 5, Fase 0.5). NO representa
personas reales de la UNSAAC. Pendiente de confirmacion del docente sobre el
origen de bdtupa antes de integrar con datos reales de produccion.

Crea:
- 1 usuario ESTUDIANTE cuyo DNI (00000001) coincide con tperfildemo, para
  probar el mecanismo de fallback de obtener_perfil_por_dni() (Fase F, caso 1).
- 1 usuario por cada uno de los 4 roles administrativos reales que existen en
  tperfil (ADMINISTRADOR, COORDINADOR DE TESORERIA, USUARIO DE RECAUDACION,
  OPERADOR DE OTI), cada uno con nombre/correo claramente ficticios y oficina
  asignada (tambien ficticia, ya que no hay dato real de a que oficina
  pertenece cada empleado - ver migracion 004).

Uso: backend/venv/Scripts/python.exe -m scripts.seed_dataset_sintetico
"""
from app import create_app
from app.extensions import db, bcrypt
from app.models.usuario import Perfil, Usuario, Login

TEST_PASSWORD = "Prueba123!"

ESTUDIANTE_DEMO = {
    "cidtusuario": "00000001",
    "cdni": "00000001",
    "ccorreo": "demo.uno@unsaac.edu.pe",
    "cnombres": "Estudiante",
    "cpaterno": "Demo",
    "cmaterno": "Uno",
    "rol": "ESTUDIANTE",
    "oficina": None,
}

ADMINISTRATIVOS_DEMO = [
    {
        "cidtusuario": "90000001",
        "cdni": "90000001",
        "ccorreo": "demo.administrador@unsaac.edu.pe",
        "cnombres": "Administrador",
        "cpaterno": "Demo",
        "cmaterno": "Sistema",
        "rol": "ADMINISTRADOR",
        "oficina": 1,
    },
    {
        "cidtusuario": "90000002",
        "cdni": "90000002",
        "ccorreo": "demo.tesoreria@unsaac.edu.pe",
        "cnombres": "Coordinador",
        "cpaterno": "Demo",
        "cmaterno": "Tesoreria",
        "rol": "COORDINADOR DE TESORERIA",
        "oficina": 1,
    },
    {
        "cidtusuario": "90000003",
        "cdni": "90000003",
        "ccorreo": "demo.recaudacion@unsaac.edu.pe",
        "cnombres": "Usuario",
        "cpaterno": "Demo",
        "cmaterno": "Recaudacion",
        "rol": "USUARIO DE RECAUDACION",
        "oficina": 1,
    },
    {
        "cidtusuario": "90000004",
        "cdni": "90000004",
        "ccorreo": "demo.oti@unsaac.edu.pe",
        "cnombres": "Operador",
        "cpaterno": "Demo",
        "cmaterno": "OTI",
        "rol": "OPERADOR DE OTI",
        "oficina": 2,
    },
]


def _crear_o_actualizar(datos):
    perfil = Perfil.query.filter_by(cdescripcionperfil=datos["rol"]).first()
    if perfil is None:
        print(f"ERROR: no existe el perfil '{datos['rol']}' en tperfil. Se omite {datos['cidtusuario']}.")
        return

    usuario = db.session.get(Usuario, datos["cidtusuario"])
    if usuario is None:
        usuario = Usuario(
            cidtusuario=datos["cidtusuario"],
            nidttipousuario=1 if datos["rol"] == "ESTUDIANTE" else 3,
            cdni=datos["cdni"],
            cnombres=datos["cnombres"],
            cpaterno=datos["cpaterno"],
            cmaterno=datos["cmaterno"],
            ccorreo=datos["ccorreo"],
        )
        db.session.add(usuario)
        print(f"Usuario creado: {datos['ccorreo']} ({datos['rol']})")
    else:
        print(f"Usuario ya existia: {datos['ccorreo']} ({datos['rol']})")

    hash_contrasenia = bcrypt.generate_password_hash(TEST_PASSWORD, rounds=12).decode("utf-8")
    login = Login.query.filter_by(cidtusuario=datos["cidtusuario"]).first()
    if login is None:
        login = Login(
            clogin=datos["cidtusuario"],
            cidtusuario=datos["cidtusuario"],
            nidtperfil=perfil.nidtperfil,
            ccontrasenia=hash_contrasenia,
            intentos_fallidos=0,
            nidtunidadorganizativa=datos["oficina"],
        )
        db.session.add(login)
    else:
        login.ccontrasenia = hash_contrasenia
        login.intentos_fallidos = 0
        login.fecha_bloqueo = None
        login.nidtunidadorganizativa = datos["oficina"]


def run():
    app = create_app()
    with app.app_context():
        _crear_o_actualizar(ESTUDIANTE_DEMO)
        for admin in ADMINISTRATIVOS_DEMO:
            _crear_o_actualizar(admin)

        db.session.commit()

        print(f"\nListo. Contrasena para todos: {TEST_PASSWORD}")
        print(f"Estudiante demo (fallback a tperfildemo): {ESTUDIANTE_DEMO['ccorreo']}")
        for a in ADMINISTRATIVOS_DEMO:
            print(f"{a['rol']}: {a['ccorreo']}")


if __name__ == "__main__":
    run()
