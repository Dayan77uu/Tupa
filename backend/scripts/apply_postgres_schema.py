"""Aplica el esquema PostgreSQL canónico de forma transaccional y controlada."""

import argparse
import os
import sys
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from sqlalchemy.engine import make_url


BACKEND_DIR = Path(__file__).resolve().parents[1]
POSTGRES_DIR = BACKEND_DIR / "database" / "postgresql"
SQL_FILES = [
    POSTGRES_DIR / "schema.sql",
    POSTGRES_DIR / "catalogo_seed.sql",
    *(POSTGRES_DIR / "migrations" / f"{number:03d}_{name}.sql" for number, name in [
        (1, "auth_audit"),
        (2, "contador_expediente"),
        (3, "estados_seguimiento"),
        (4, "bandeja_derivacion"),
        (5, "dataset_sintetico"),
        (6, "correo_institucional_generado"),
        (7, "activacion_cuenta"),
    ]),
]


def connection_kwargs(database_url):
    parsed = make_url(database_url.replace("postgres://", "postgresql://", 1))
    kwargs = parsed.translate_connect_args(username="user", database="dbname")
    kwargs.update(parsed.query)
    return kwargs


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Confirma la transacción. Sin esta opción siempre hace rollback.",
    )
    parser.add_argument("--env-file", default=str(BACKEND_DIR / ".env"))
    parser.add_argument(
        "--allow-remote",
        action="store_true",
        help="Autoriza explícitamente un destino PostgreSQL no local.",
    )
    args = parser.parse_args()

    load_dotenv(args.env_file, override=True)
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL no está configurada.", file=sys.stderr)
        return 1

    missing = [str(path) for path in SQL_FILES if not path.is_file()]
    if missing:
        print(f"ERROR: faltan archivos SQL: {missing}", file=sys.stderr)
        return 1

    connection = psycopg2.connect(**connection_kwargs(database_url))
    connection.autocommit = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_database(), inet_server_addr()::text")
            database, host = cursor.fetchone()
            is_local = host in {"127.0.0.1", "127.0.0.1/32", "::1"}
            if not is_local and not args.allow_remote:
                raise RuntimeError(
                    "Destino remoto detectado. Repite con --allow-remote tras verificarlo."
                )
            cursor.execute(
                "SELECT count(*) FROM pg_tables WHERE schemaname = 'public'"
            )
            table_count = cursor.fetchone()[0]
            print(f"Destino: base={database}, host={host}, tablas_publicas={table_count}")

            if table_count != 0:
                raise RuntimeError(
                    "El esquema public no está vacío; se aborta para impedir una aplicación doble."
                )

            cursor.execute("SELECT pg_advisory_xact_lock(84112026)")
            for path in SQL_FILES:
                print(f"Aplicando {path.relative_to(BACKEND_DIR)}")
                cursor.execute(path.read_text(encoding="utf-8"))

            cursor.execute(
                """
                SELECT
                  (SELECT count(*) FROM pg_tables WHERE schemaname = 'public'),
                  (SELECT count(*) FROM information_schema.columns WHERE table_schema = 'public'),
                  (SELECT count(*) FROM information_schema.table_constraints
                   WHERE constraint_schema = 'public' AND constraint_type = 'FOREIGN KEY'),
                  (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public'),
                  (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                   WHERE c.relkind = 'S' AND n.nspname = 'public')
                """
            )
            counts = cursor.fetchone()
            print(
                "Resultado: "
                f"tablas={counts[0]}, columnas={counts[1]}, fks={counts[2]}, "
                f"índices={counts[3]}, secuencias={counts[4]}"
            )
            if counts != (44, 318, 52, 44, 26):
                raise RuntimeError(f"Recuentos inesperados: {counts}")

        if args.apply:
            connection.commit()
            print("Migración confirmada.")
        else:
            connection.rollback()
            print("Simulación correcta; rollback ejecutado.")
        return 0
    except Exception as error:
        connection.rollback()
        print(f"ERROR: {type(error).__name__}: {error}", file=sys.stderr)
        return 1
    finally:
        connection.close()


if __name__ == "__main__":
    raise SystemExit(main())
