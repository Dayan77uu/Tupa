"""Prueba E2E de carga privada y descarga administrativa de un documento."""

from io import BytesIO

from app import create_app


PASSWORD = "Prueba123!"
PDF_DATA = b"%PDF-1.4\n% Documento sintetico TUPA\n%%EOF\n"


def token(client, email):
    response = client.post(
        "/api/auth/login", json={"correo": email, "contrasena": PASSWORD}
    )
    if response.status_code != 200:
        raise RuntimeError(f"No se pudo autenticar {email}: {response.status_code}")
    return {"Authorization": f"Bearer {response.get_json()['token']}"}


def main():
    app = create_app()
    client = app.test_client()
    user_headers = token(client, "estudiante.prueba@unsaac.edu.pe")
    admin_headers = token(client, "administrativo.prueba@unsaac.edu.pe")

    created = client.post(
        "/api/solicitudes",
        headers=user_headers,
        json={"ccodigo": "PA88401484E"},
    )
    if created.status_code != 201:
        raise RuntimeError(f"Creación falló: {created.status_code} {created.get_json()}")
    case_number = created.get_json()["nro_expediente"]

    uploaded = client.post(
        f"/api/solicitudes/{case_number}/documentos",
        headers=user_headers,
        data={
            "id_requisito": "1",
            "archivo": (BytesIO(PDF_DATA), "solicitud-prueba.pdf"),
        },
        content_type="multipart/form-data",
    )
    if uploaded.status_code != 200:
        raise RuntimeError(f"Carga falló: {uploaded.status_code} {uploaded.get_json()}")

    detail = client.get(
        f"/api/admin/expedientes/{case_number}", headers=admin_headers
    )
    if detail.status_code != 200:
        raise RuntimeError(f"Detalle falló: {detail.status_code} {detail.get_json()}")
    documents = detail.get_json()["documentos"]
    if len(documents) != 1:
        raise RuntimeError(f"Documentos inesperados: {len(documents)}")

    downloaded = client.get(documents[0]["url_visualizar"], headers=admin_headers)
    if downloaded.status_code != 200 or downloaded.data != PDF_DATA:
        raise RuntimeError(
            f"Descarga falló o contenido distinto: HTTP {downloaded.status_code}"
        )
    print(
        f"Documento E2E OK: expediente={case_number}, "
        f"id_documento={documents[0]['id_documento']}, bytes={len(downloaded.data)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
