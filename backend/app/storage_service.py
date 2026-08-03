"""Almacenamiento privado de documentos con backend local o Supabase Storage."""

import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from app.config import Config


class StorageError(RuntimeError):
    pass


def _local_path(object_path):
    root = Path(Config.UPLOAD_FOLDER).resolve()
    target = (root / object_path).resolve()
    if root != target and root not in target.parents:
        raise StorageError("Ruta de almacenamiento no permitida")
    return target


def _supabase_request(object_path, method="GET", data=None, content_type=None):
    if not Config.SUPABASE_URL or not Config.SUPABASE_SECRET_KEY:
        raise StorageError("Supabase Storage no está configurado")
    encoded_path = urllib.parse.quote(object_path, safe="/")
    url = (
        f"{Config.SUPABASE_URL.rstrip('/')}/storage/v1/object/"
        f"{Config.SUPABASE_STORAGE_BUCKET}/{encoded_path}"
    )
    headers = {
        "apikey": Config.SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {Config.SUPABASE_SECRET_KEY}",
    }
    if content_type:
        headers["Content-Type"] = content_type
        headers["x-upsert"] = "true"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read()
    except urllib.error.HTTPError as error:
        raise StorageError(f"Supabase Storage respondió HTTP {error.code}") from error
    except urllib.error.URLError as error:
        raise StorageError("No se pudo conectar con Supabase Storage") from error


def save(object_path, data, content_type):
    if Config.STORAGE_BACKEND == "supabase":
        _supabase_request(object_path, method="POST", data=data, content_type=content_type)
        return
    target = _local_path(object_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)


def read(object_path):
    if Config.STORAGE_BACKEND == "supabase":
        return _supabase_request(object_path)
    target = _local_path(object_path)
    if not target.is_file():
        raise StorageError("Documento no encontrado en almacenamiento")
    return target.read_bytes()


def delete(object_path):
    if not object_path:
        return
    if Config.STORAGE_BACKEND == "supabase":
        _supabase_request(object_path, method="DELETE")
        return
    target = _local_path(object_path)
    if target.is_file():
        os.remove(target)
