"""Comprueba la conexión PostgreSQL sin imprimir credenciales."""

import argparse
import os
import sys

import psycopg2
from dotenv import load_dotenv
from sqlalchemy.engine import make_url


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", default=".env")
    args = parser.parse_args()

    load_dotenv(args.env_file, override=True)
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL no está configurada.", file=sys.stderr)
        return 1

    connection = None
    try:
        parsed_url = make_url(database_url.replace("postgres://", "postgresql://", 1))
        print(
            "URL detectada: "
            f"driver={parsed_url.drivername}, host={parsed_url.host}, "
            f"puerto={parsed_url.port}, base={parsed_url.database}, "
            f"usuario_configurado={bool(parsed_url.username)}, "
            f"contraseña_configurada={bool(parsed_url.password)}"
        )
        connection_args = parsed_url.translate_connect_args(
            username="user", database="dbname"
        )
        connection_args.update(parsed_url.query)
        connection = psycopg2.connect(**connection_args)
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT current_database(), inet_server_addr()::text,
                       inet_server_port(),
                       (SELECT count(*) FROM pg_tables WHERE schemaname = 'public')
                """
            )
            database, host, port, table_count = cursor.fetchone()
        print(
            f"Conexión OK: base={database}, host={host}, "
            f"puerto={port}, tablas_publicas={table_count}"
        )
        return 0
    except Exception as error:
        print(
            f"ERROR de conexión: {type(error).__name__} "
            f"(código PostgreSQL: {getattr(error, 'pgcode', None)})",
            file=sys.stderr,
        )
        return 1
    finally:
        if connection is not None:
            connection.close()


if __name__ == "__main__":
    raise SystemExit(main())
