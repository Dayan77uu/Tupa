from datetime import datetime, timedelta

import jwt
import pytest

from app import create_app
from app.config import Config
from app.extensions import db
from app.models.usuario import Login

CORREO_VALIDO = "estudiante.prueba@unsaac.edu.pe"
PASSWORD_VALIDO = "Prueba123!"
CIDTUSUARIO_PRUEBA = "99999999"


@pytest.fixture
def app():
    app = create_app()
    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture(autouse=True)
def resetear_login_prueba(app):
    """Deja el usuario de prueba sin bloqueo antes de cada test."""
    with app.app_context():
        login = Login.query.filter_by(cidtusuario=CIDTUSUARIO_PRUEBA).first()
        if login:
            login.intentos_fallidos = 0
            login.fecha_bloqueo = None
            db.session.commit()
    yield
    with app.app_context():
        login = Login.query.filter_by(cidtusuario=CIDTUSUARIO_PRUEBA).first()
        if login:
            login.intentos_fallidos = 0
            login.fecha_bloqueo = None
            db.session.commit()


def test_login_valido_devuelve_token_y_rol(client):
    resp = client.post(
        "/api/auth/login",
        json={"correo": CORREO_VALIDO, "contrasena": PASSWORD_VALIDO},
    )
    assert resp.status_code == 200
    body = resp.get_json()
    assert "token" in body
    assert body["rol"] == "ESTUDIANTE"


def test_correo_con_dominio_incorrecto_no_consulta_bd(client):
    resp = client.post(
        "/api/auth/login",
        json={"correo": "alguien@gmail.com", "contrasena": "loquesea"},
    )
    assert resp.status_code == 400
    assert "institucionales" in resp.get_json()["error"]


def test_contrasena_incorrecta_devuelve_mensaje_generico(client):
    resp = client.post(
        "/api/auth/login",
        json={"correo": CORREO_VALIDO, "contrasena": "incorrecta"},
    )
    assert resp.status_code == 401
    assert resp.get_json()["error"] == "Correo o contraseña incorrectos"


def test_bloqueo_tras_cinco_intentos_fallidos(client):
    for _ in range(4):
        resp = client.post(
            "/api/auth/login",
            json={"correo": CORREO_VALIDO, "contrasena": "incorrecta"},
        )
        assert resp.status_code == 401

    resp = client.post(
        "/api/auth/login",
        json={"correo": CORREO_VALIDO, "contrasena": "incorrecta"},
    )
    assert resp.status_code == 403
    assert "bloqueada" in resp.get_json()["error"]

    resp = client.post(
        "/api/auth/login",
        json={"correo": CORREO_VALIDO, "contrasena": PASSWORD_VALIDO},
    )
    assert resp.status_code == 403
    assert "bloqueada" in resp.get_json()["error"]


def test_token_expirado_es_rechazado_por_requiere_auth(app):
    from app.auth.decorators import requiere_auth

    @requiere_auth
    def vista_protegida():
        return {"ok": True}

    with app.app_context():
        payload = {
            "id_usuario": CIDTUSUARIO_PRUEBA,
            "rol": "ESTUDIANTE",
            "exp": datetime.utcnow() - timedelta(minutes=1),
        }
        token_expirado = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")

    with app.test_request_context(
        "/cualquier-ruta", headers={"Authorization": f"Bearer {token_expirado}"}
    ):
        body, status = vista_protegida()
        assert status == 401
        assert "expirado" in body.get_json()["error"]
