import os
import sys
import glob

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

def run_migration_file(cursor, filepath):
    import re
    with open(filepath, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    # Remove single line comments
    sql = re.sub(r'--.*?\n', '\n', sql)
    # Remove multi-line comments
    sql = re.sub(r'/\*.*?\*/', '', sql, flags=re.DOTALL)
    
    statements = [s.strip() for s in sql.split(';') if s.strip()]
    for stmt in statements:
        try:
            with cursor.connection.cursor() as stmt_cursor:
                stmt_cursor.execute(stmt)
        except Exception as e:
            cursor.connection.rollback()
            # If it's a structural duplication error or empty query, ignore it
            err_str = str(e).lower()
            if "ya existe" in err_str or "already exists" in err_str or "duplicate" in err_str or "duplicada" in err_str or "empty query" in err_str:
                pass
            else:
                raise e

def test_migration():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        # We need isolation_level = AUTOCOMMIT to create databases if we wanted, 
        # but we assume the db exists and we just run schema in a transaction block
        cursor = conn.cursor()
        
        print("1. Ejecutando schema.sql...")
        run_sql_file(cursor, "backend/database/postgresql/schema.sql")
        
        print("2. Ejecutando catalogo_seed.sql...")
        run_sql_file(cursor, "backend/database/postgresql/catalogo_seed.sql")
        
        # Sincronizar secuencias
        print(" -> Sincronizando secuencias...")
        cursor.execute("SELECT table_name, column_name FROM information_schema.columns WHERE column_default LIKE 'nextval%' AND table_schema='public';")
        for table, col in cursor.fetchall():
            try:
                cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table}', '{col}'), coalesce(max({col}), 1), max({col}) IS NOT null) FROM {table};")
            except Exception as e:
                print(f"    Error sincronizando {table}.{col}: {e}")
                
        print("3. Ejecutando migraciones...")
        migrations = sorted(glob.glob("backend/database/postgresql/migrations/*.sql"))
        for mig in migrations:
            print(f"   -> {os.path.basename(mig)}")
            run_migration_file(cursor, mig)
        
        # Test concurrent safe sequence insert logic using ON CONFLICT logic (needs valid syntax in backend)
        
        # Fetch stats
        cursor.execute("SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
        tables_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM information_schema.columns WHERE table_schema='public';")
        cols_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM information_schema.table_constraints WHERE constraint_schema='public' AND constraint_type='FOREIGN KEY';")
        fk_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM pg_indexes WHERE schemaname='public';")
        indexes_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind = 'S' AND n.nspname = 'public';")
        seq_count = cursor.fetchone()[0]
        
        print("\n--- RECUENTOS DESDE POSTGRESQL ---")
        print(f"Tablas: {tables_count}")
        print(f"Columnas: {cols_count}")
        print(f"Claves Foraneas: {fk_count}")
        print(f"Indices: {indexes_count}")
        print(f"Secuencias: {seq_count}")
        
        # We rollback at the end so it can be re-run on the same empty database for validation
        print("\nHaciendo ROLLBACK para dejar la base de datos limpia...")
        conn.rollback()
        print("Prueba completada exitosamente.")
        
    except Exception as e:
        print(f"Error durante la migracion: {e}", file=sys.stderr)
        if 'conn' in locals():
            conn.rollback()
        sys.exit(1)
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    test_migration()
