import os
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from dotenv import load_dotenv

load_dotenv()


def _database_url():
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError(
            "DATABASE_URL es obligatoria. Configúrala con una URL PostgreSQL."
        )

    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg2://" + url[len("postgresql://"):]

    parsed = urlsplit(url)
    if parsed.hostname and parsed.hostname.endswith("supabase.co"):
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        query.setdefault("sslmode", "require")
        url = urlunsplit(parsed._replace(query=urlencode(query)))
    return url


class Config:
    JWT_SECRET = os.environ.get("JWT_SECRET_KEY") or os.environ["JWT_SECRET"]

    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS", "http://localhost:8000,http://127.0.0.1:8000"
        ).split(",")
        if origin.strip()
    ]

    BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5000")
    FRONTEND_URL = os.environ.get(
        "FRONTEND_URL",
        CORS_ORIGINS[0] if CORS_ORIGINS else "http://localhost:8000",
    )

    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024
    FORMATOS_PERMITIDOS_DEFAULT = {"pdf", "jpg", "jpeg", "png"}

    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get(
        "SUPABASE_SERVICE_ROLE_KEY"
    )
    SUPABASE_STORAGE_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "documentos-tupa")
    STORAGE_BACKEND = os.environ.get(
        "STORAGE_BACKEND",
        "supabase" if SUPABASE_URL and SUPABASE_SECRET_KEY else "local",
    )

    # Opcionales: si no estan configuradas, las notificaciones quedan en modo
    # simulado (se registran en BD y se imprime en consola, sin enviar correo real).
    SMTP_HOST = os.environ.get("SMTP_HOST")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
    SMTP_USER = os.environ.get("SMTP_USER")
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
    SMTP_FROM = os.environ.get("SMTP_FROM") or SMTP_USER
