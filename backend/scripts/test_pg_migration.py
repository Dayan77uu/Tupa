import os
import sys
import glob

__test__ = False

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    import psycopg2
except ImportError:
    print("ERROR: El modulo 'psycopg2' no esta instalado en este entorno Python.", file=sys.stderr)
    print("Para instalarlo en un entorno virtual (recomendado): pip install psycopg2-binary", file=sys.stderr)
    print("Para instalarlo en MSYS2 (UCRT64): pacman -S mingw-w64-ucrt-x86_64-python-psycopg2", file=sys.stderr)
    sys.exit(1)

def run_sql_file(cursor, filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        sql = f.read()
    if sql.strip():
        cursor.execute(sql)

def get_db_stats(cursor):
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")
    tables = cursor.fetchall()

    cursor.execute("SELECT table_name, column_name, data_type, ordinal_position FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name, ordinal_position;")
    columns = cursor.fetchall()

    cursor.execute("""
        SELECT c.relname AS table_name, con.conname AS constraint_name, con.contype AS constraint_type, pg_get_constraintdef(con.oid, true) AS definition
        FROM pg_constraint con
        JOIN pg_class c ON con.conrelid = c.oid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
        ORDER BY c.relname, con.conname;
    """)
    constraints = cursor.fetchall()
    fk_count = len([c for c in constraints if c[2] == 'f'])

    cursor.execute("SELECT indexname, tablename, indexdef FROM pg_indexes WHERE schemaname='public' ORDER BY indexname, tablename;")
    indexes = cursor.fetchall()

    cursor.execute("SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind = 'S' AND n.nspname = 'public' ORDER BY c.relname;")
    sequences = cursor.fetchall()

    counts = (len(tables), len(columns), fk_count, len(indexes), len(sequences))
    snapshot = {
        "tables": tables,
        "columns": columns,
        "constraints": constraints,
        "indexes": indexes,
        "sequences": sequences
    }
    return counts, snapshot

def run_migration_file(cursor, filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        sql = f.read()
    if sql.strip():
        cursor.execute(sql)

def test_migration():
    import getpass
    db_url = os.environ.get("DATABASE_URL")

    conn_kwargs = None
    if not db_url:
        if not sys.stdin.isatty():
            print("ERROR: DATABASE_URL environment variable is not set and execution is not interactive.", file=sys.stderr)
            sys.exit(1)
        print("La variable DATABASE_URL no está definida.")
        print("Por favor, ingresa los datos para conectarse a PostgreSQL local.")
        host = input("Host [127.0.0.1]: ").strip() or "127.0.0.1"
        port = input("Puerto [5433]: ").strip() or "5433"
        db = input("Base de datos [tupa_test_1]: ").strip() or "tupa_test_1"
        user = input("Usuario [postgres]: ").strip() or "postgres"
        pwd = getpass.getpass(f"Contraseña para {user}: ")
        conn_kwargs = {
            "host": host,
            "port": port,
            "dbname": db,
            "user": user,
            "password": pwd
        }
        print(f"\nConectando a {host}:{port}/{db} como {user}...")

    conn = None
    cursor = None
    try:
        if db_url:
            conn = psycopg2.connect(db_url)
        else:
            conn = psycopg2.connect(**conn_kwargs)
        conn.autocommit = False
        cursor = conn.cursor()

        cursor.execute("SELECT current_database()")
        connected_db = cursor.fetchone()[0]

        if connected_db != "tupa_test_1":
            raise RuntimeError(
                f"Base no autorizada: {connected_db}. "
                "Esta prueba solo puede ejecutarse en tupa_test_1."
            )

        initial_counts, initial_snapshot = get_db_stats(cursor)

        print("1. Ejecutando schema.sql...")
        run_sql_file(cursor, os.path.join(BACKEND_DIR, "database", "postgresql", "schema.sql"))
        
        print("2. Ejecutando catalogo_seed.sql...")
        run_sql_file(cursor, os.path.join(BACKEND_DIR, "database", "postgresql", "catalogo_seed.sql"))
        
        print(" -> Sincronizando secuencias...")
        cursor.execute("SELECT table_name, column_name FROM information_schema.columns WHERE column_default LIKE 'nextval%' AND table_schema='public';")
        for table, col in cursor.fetchall():
            try:
                cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table}', '{col}'), coalesce(max({col}), 1), max({col}) IS NOT null) FROM {table};")
            except Exception as e:
                print(f"    Error sincronizando {table}.{col}: {e}")
                
        print("3. Ejecutando migraciones...")
        migrations = sorted(glob.glob(os.path.join(BACKEND_DIR, "database", "postgresql", "migrations", "*.sql")))
        for mig in migrations:
            print(f"   -> {os.path.basename(mig)}")
            run_migration_file(cursor, mig)
        
        post_run_counts, _ = get_db_stats(cursor)
        print("\n--- RECUENTOS DESDE POSTGRESQL (PRE-ROLLBACK) ---")
        print(f"Tablas: {post_run_counts[0]}")
        print(f"Columnas: {post_run_counts[1]}")
        print(f"Claves Foraneas: {post_run_counts[2]}")
        print(f"Indices: {post_run_counts[3]}")
        print(f"Secuencias: {post_run_counts[4]}")

        print("\nEjecutando ROLLBACK para restaurar el estado inicial...")
        conn.rollback()

        final_counts, final_snapshot = get_db_stats(cursor)
        if final_snapshot != initial_snapshot:
            print("Diferencias detectadas post-rollback:", file=sys.stderr)
            for k in initial_snapshot.keys():
                if initial_snapshot[k] != final_snapshot[k]:
                    print(f"--- Diferencia en {k} ---", file=sys.stderr)
                    print("Inicial:", initial_snapshot[k], file=sys.stderr)
                    print("Final:", final_snapshot[k], file=sys.stderr)
            raise Exception("El rollback no fue efectivo. El estado del esquema difiere del inicial.")

        print("ROLLBACK verificado: los cambios de la prueba fueron revertidos.")
        print("Prueba completada exitosamente.")
        
    except Exception as e:
        print(f"Error durante la migracion: {e}", file=sys.stderr)
        if conn is not None:
            try:
                conn.rollback()
            except Exception:
                pass
        sys.exit(1)
    finally:
        if cursor is not None:
            try:
                cursor.close()
            except Exception:
                pass
        if conn is not None:
            try:
                conn.close()
            except Exception:
                pass

if __name__ == "__main__":
    test_migration()
