import bcrypt as bcrypt_lib
from flask_sqlalchemy import SQLAlchemy


class Bcrypt:
    """Adaptador mínimo compatible con los usos actuales de Flask-Bcrypt."""

    @staticmethod
    def generate_password_hash(password, rounds=12):
        password_bytes = password.encode("utf-8") if isinstance(password, str) else password
        return bcrypt_lib.hashpw(password_bytes, bcrypt_lib.gensalt(rounds=rounds))

    @staticmethod
    def check_password_hash(password_hash, password):
        hash_bytes = (
            password_hash.encode("utf-8")
            if isinstance(password_hash, str)
            else password_hash
        )
        password_bytes = password.encode("utf-8") if isinstance(password, str) else password
        return bcrypt_lib.checkpw(password_bytes, hash_bytes)

db = SQLAlchemy()
bcrypt = Bcrypt()
