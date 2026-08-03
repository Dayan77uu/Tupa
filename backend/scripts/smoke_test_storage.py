"""Prueba controlada de Supabase Storage con un objeto sintético."""

import argparse
import os

from dotenv import load_dotenv


TEST_PATH = "smoke-tests/storage-check.pdf"
TEST_DATA = b"%PDF-1.4\n% TUPA storage smoke test\n%%EOF\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", default=".env.supabase")
    parser.add_argument("--delete", action="store_true")
    args = parser.parse_args()

    load_dotenv(args.env_file, override=True)
    os.environ["STORAGE_BACKEND"] = "supabase"

    from app import storage_service

    if args.delete:
        storage_service.delete(TEST_PATH)
        print(f"Eliminación OK: {TEST_PATH}")
        return 0

    storage_service.save(TEST_PATH, TEST_DATA, "application/pdf")
    downloaded = storage_service.read(TEST_PATH)
    if downloaded != TEST_DATA:
        raise RuntimeError("El contenido descargado no coincide con el cargado")
    print(f"Carga y descarga OK: {TEST_PATH}, bytes={len(downloaded)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
