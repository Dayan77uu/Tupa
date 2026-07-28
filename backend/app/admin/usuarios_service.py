from app.extensions import db, bcrypt
from app.models.usuario import Usuario, Login, Perfil
from app.auth.decorators import ROLES_PERSONAL_ADMINISTRATIVO, ROLES_ADMINISTRADOR_SISTEMA

ROLES_ASIGNABLES = ROLES_PERSONAL_ADMINISTRATIVO | ROLES_ADMINISTRADOR_SISTEMA | {"ESTUDIANTE"}


def crear_usuario(data: dict):
    """Crea un usuario del dataset sintetico (Fase 0.5): nombre/correo/DNI
    deben ser claramente ficticios, nunca datos reales de talumno."""
    cidtusuario = data.get("cidtusuario")
    correo = data.get("correo")
    rol = data.get("rol")

    if not cidtusuario or not correo or not rol:
        return 400, {"error": "cidtusuario, correo y rol son requeridos"}

    if not correo.lower().endswith("@unsaac.edu.pe"):
        return 400, {"error": "El correo debe ser institucional (@unsaac.edu.pe)"}

    if rol not in ROLES_ASIGNABLES:
        return 400, {"error": f"rol debe ser uno de: {', '.join(sorted(ROLES_ASIGNABLES))}"}

    if db.session.get(Usuario, cidtusuario) is not None:
        return 400, {"error": "Ya existe un usuario con ese cidtusuario"}

    perfil = Perfil.query.filter_by(cdescripcionperfil=rol).first()
    if perfil is None:
        return 400, {"error": f"El perfil '{rol}' no existe en tperfil"}

    oficina = data.get("oficina") if rol != "ESTUDIANTE" else None

    usuario = Usuario(
        cidtusuario=cidtusuario,
        nidttipousuario=1 if rol == "ESTUDIANTE" else 3,
        cdni=data.get("dni", cidtusuario),
        cnombres=data.get("nombres", "Usuario"),
        cpaterno=data.get("apellido_paterno", "Demo"),
        cmaterno=data.get("apellido_materno", "Sintetico"),
        ccorreo=correo,
    )
    db.session.add(usuario)

    contrasena = data.get("contrasena", "Prueba123!")
    login = Login(
        clogin=cidtusuario,
        cidtusuario=cidtusuario,
        nidtperfil=perfil.nidtperfil,
        ccontrasenia=bcrypt.generate_password_hash(contrasena, rounds=12).decode("utf-8"),
        intentos_fallidos=0,
        nidtunidadorganizativa=oficina,
    )
    db.session.add(login)
    db.session.commit()

    return 201, {"cidtusuario": cidtusuario, "correo": correo, "rol": rol, "oficina": oficina}
