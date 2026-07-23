import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_HOST = os.environ["DB_HOST"]
    DB_PORT = os.environ.get("DB_PORT", "3306")
    DB_USER = os.environ["DB_USER"]
    DB_PASSWORD = os.environ["DB_PASSWORD"]
    DB_NAME = os.environ["DB_NAME"]
    JWT_SECRET = os.environ["JWT_SECRET"]

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        "?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024
    FORMATOS_PERMITIDOS_DEFAULT = {"pdf", "jpg", "jpeg", "png"}

    # Opcionales: si no estan configuradas, las notificaciones quedan en modo
    # simulado (se registran en BD y se imprime en consola, sin enviar correo real).
    SMTP_HOST = os.environ.get("SMTP_HOST")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
    SMTP_USER = os.environ.get("SMTP_USER")
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
