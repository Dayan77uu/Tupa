"""Prueba de humo de los flujos principales contra la base configurada."""

from app import create_app


USER_EMAIL = "estudiante.prueba@unsaac.edu.pe"
ADMIN_EMAIL = "administrativo.prueba@unsaac.edu.pe"
TEST_PASSWORD = "Prueba123!"


def require(response, expected, label):
    if response.status_code != expected:
        raise RuntimeError(
            f"{label}: HTTP {response.status_code}, respuesta={response.get_json()}"
        )
    print(f"OK {label}: HTTP {response.status_code}")
    return response.get_json()


def login(client, email):
    body = require(
        client.post(
            "/api/auth/login",
            json={"correo": email, "contrasena": TEST_PASSWORD},
        ),
        200,
        f"login {email}",
    )
    return {"Authorization": f"Bearer {body['token']}"}


def main():
    app = create_app()
    client = app.test_client()

    require(client.get("/health"), 200, "health")
    catalog = require(client.get("/api/catalogo"), 200, "catálogo")
    procedures = catalog.get("resultados", [])
    if not procedures:
        raise RuntimeError("El catálogo no contiene procedimientos activos.")

    user_headers = login(client, USER_EMAIL)
    admin_headers = login(client, ADMIN_EMAIL)
    require(client.get("/api/mi-perfil", headers=user_headers), 200, "perfil")

    selected = None
    for procedure in procedures:
        code = procedure["codigo"]
        checklist = require(
            client.get(f"/api/tramites/{code}/checklist", headers=user_headers),
            200,
            f"checklist {code}",
        )
        if not checklist.get("requisitos"):
            selected = code
            break
    if selected is None:
        raise RuntimeError("No hay un procedimiento sin requisitos para la prueba de humo.")

    created = require(
        client.post(
            "/api/solicitudes",
            headers=user_headers,
            json={"ccodigo": selected},
        ),
        201,
        "crear solicitud",
    )
    case_number = created["nro_expediente"]
    require(
        client.post(f"/api/solicitudes/{case_number}/confirmar", headers=user_headers),
        200,
        "confirmar solicitud",
    )
    require(client.get("/api/mis-expedientes", headers=user_headers), 200, "seguimiento")
    require(
        client.get(f"/api/expedientes/{case_number}/historial", headers=user_headers),
        200,
        "historial",
    )
    require(client.get("/api/admin/bandeja", headers=admin_headers), 200, "bandeja")
    require(
        client.get(f"/api/admin/expedientes/{case_number}", headers=admin_headers),
        200,
        "detalle administrativo",
    )
    print(f"Prueba de humo completada con expediente de prueba {case_number}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
