import os
import re

def convert_to_pg(filepath, outpath, is_schema=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove LOCK/UNLOCK TABLES
    content = re.sub(r'(?i)UNLOCK TABLES.*?;[\r\n]*', '', content)
    content = re.sub(r'(?i)LOCK TABLES.*?;[\r\n]*', '', content)
    
    # Remove MySQL pragmas
    content = re.sub(r'/\*!.*?\*/;', '', content)
    content = re.sub(r'/\*!.*?\*/', '', content)
    
    # Remove backticks and COMMENTS
    content = content.replace('`', '')
    content = re.sub(r"(?i)COMMENT\s+'[^']*'", "", content)

    
    # Convert data types and table definitions
    if is_schema:
        # Extract only CREATE TABLE and ALTER TABLE blocks
        tables = []
        fks = []
        for match in re.finditer(r'(?i)CREATE TABLE (.*?) \((.*?)\) ENGINE=.*?;\n', content, re.DOTALL):
            table_name = match.group(1)
            columns = match.group(2)
            
            # Type conversions
            columns = re.sub(r'(?i)int\([0-9]+\)\s+NOT\s+NULL\s+AUTO_INCREMENT', 'SERIAL', columns)
            columns = re.sub(r'(?i)int\s+NOT\s+NULL\s+AUTO_INCREMENT', 'SERIAL', columns)
            columns = re.sub(r'(?i)bigint\([0-9]+\)\s+NOT\s+NULL\s+AUTO_INCREMENT', 'BIGSERIAL', columns)
            
            columns = re.sub(r'(?i)tinyint\(1\)', 'BOOLEAN', columns)
            columns = re.sub(r'(?i)int\([0-9]+\)', 'INTEGER', columns)
            columns = re.sub(r'(?i)varchar\(([0-9]+)\)', r'VARCHAR(\1)', columns)
            columns = re.sub(r'(?i)datetime', 'TIMESTAMP', columns)
            columns = re.sub(r'(?i)double', 'DOUBLE PRECISION', columns)
            
            # Remove CHARACTER SET collation
            columns = re.sub(r'(?i)CHARACTER SET [a-zA-Z0-9_]+ COLLATE [a-zA-Z0-9_]+', '', columns)
            columns = re.sub(r'(?i)CHARACTER SET [a-zA-Z0-9_]+', '', columns)
            columns = re.sub(r'(?i)COLLATE [a-zA-Z0-9_]+', '', columns)
            
            # Convert ENUM
            columns = re.sub(r'(?i)enum\([^)]+\)', 'VARCHAR(255)', columns)
            
            # Constraints and Indexes
            columns = re.sub(r'(?i)UNIQUE KEY [a-zA-Z0-9_]+ \((.*?)\)', r'UNIQUE (\1)', columns)
            columns = re.sub(r'(?i)KEY [a-zA-Z0-9_]+ \((.*?)\)', '', columns)
            
            lines = [l.strip() for l in columns.split('\n') if l.strip()]
            valid_lines = []
            for line in lines:
                if line.endswith(','): line = line[:-1]
                if line.upper().startswith('KEY '): continue
                if line == '': continue
                
                # Extract FOREIGN KEY constraints to add at the end
                fk_match = re.search(r'(?i)(CONSTRAINT\s+[a-zA-Z0-9_]+\s+FOREIGN\s+KEY.*)', line)
                if fk_match:
                    fks.append(f"ALTER TABLE {table_name} ADD {fk_match.group(1)};")
                    continue
                    
                valid_lines.append(line)
            
            cleaned_columns = ',\n  '.join(valid_lines)
            
            pg_table = f"CREATE TABLE {table_name} (\n  {cleaned_columns}\n);\n"
            tables.append(pg_table)
            
        cast_sql = """
UPDATE pg_cast SET castcontext = 'i' WHERE castsource = 'integer'::regtype AND casttarget = 'boolean'::regtype;
"""
        content = cast_sql + "\n\n" + "\n\n".join(tables) + "\n\n" + "\n".join(fks) + "\n"
        
    else:
        # It's a seed or migration file
        content = re.sub(r'(?i)tinyint\(1\)', 'BOOLEAN', content)
        content = re.sub(r'(?i)datetime', 'TIMESTAMP', content)
        content = re.sub(r'(?i)INSERT IGNORE INTO', 'INSERT INTO', content)
        content = content.replace("'0000-00-00 00:00:00'", "NULL")
        content = content.replace("'0000-00-00'", "NULL")
        
        # Migrations cleanup
        content = re.sub(r'(?i)INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY', 'SERIAL PRIMARY KEY', content)
        content = re.sub(r'(?i)BIGINT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY', 'BIGSERIAL PRIMARY KEY', content)
        content = re.sub(r'(?i)USE\s+[a-zA-Z0-9_]+;', '', content)
        content = re.sub(r'(?i)\)\s*ENGINE=InnoDB;', ');', content)
        content = re.sub(r'(?i)MODIFY\s+COLUMN', 'ALTER COLUMN', content)
        content = re.sub(r'(?i)UNIQUE\s+KEY\s+[a-zA-Z0-9_]+\s+\((.*?)\)', r'UNIQUE (\1)', content)
        content = re.sub(r'(?i)ADD\s+COLUMN\s+(?!IF\s+NOT\s+EXISTS)', 'ADD COLUMN IF NOT EXISTS ', content)
        content = re.sub(r'(?i)CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)', 'CREATE TABLE IF NOT EXISTS ', content)
        content = re.sub(r'(?i)CHARACTER\s+SET\s+[a-zA-Z0-9_]+\s+COLLATE\s+[a-zA-Z0-9_]+', '', content)
        content = re.sub(r'(?i)CHARACTER\s+SET\s+[a-zA-Z0-9_]+', '', content)
        content = re.sub(r'(?i)COLLATE\s+[a-zA-Z0-9_]+', '', content)
        
        # Specific migration fixes
        content = re.sub(r'(?i)ALTER\s+TABLE\s+[a-zA-Z0-9_]+\s+ALTER\s+COLUMN\s+([a-zA-Z0-9_]+)\s+ENUM\([^)]+\)\s+NOT\s+NULL\s+DEFAULT\s+\'[^\']+\';?', '', content)
        content = re.sub(r'(?i)ALTER\s+COLUMN\s+([a-zA-Z0-9_]+)\s+INT\s+NOT\s+NULL', r'ALTER COLUMN \1 TYPE INTEGER, ALTER COLUMN \1 SET NOT NULL', content)
        
        # Make inserts idempotent
        content = re.sub(r'(?i)(INSERT\s+INTO\s+[a-zA-Z0-9_]+\s+(?:\([^)]+\)\s+)?VALUES\s*[^;]+);', r'\1 ON CONFLICT DO NOTHING;', content)
        
        # PostgreSQL doesn't support AFTER column_name
        content = re.sub(r'(?i)\s+AFTER\s+[a-zA-Z0-9_]+', '', content)
        
        # PostgreSQL doesn't support UPDATE ... JOIN ... SET ...
        update_join_pattern = r"(?i)UPDATE\s+([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_]+)\s+JOIN\s+\((.*?)\)\s+([a-zA-Z0-9_]+)\s+ON\s+(.*?)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*?))?;"
        
        def update_repl(m):
            set_clause = m.group(6).strip()
            # Strip table alias from SET column if present (e.g. e.col = val -> col = val)
            set_clause = re.sub(r'^[a-zA-Z0-9_]+\.([a-zA-Z0-9_]+)', r'\1', set_clause)
            
            where_orig = m.group(7)
            where_new = m.group(5).strip()
            if where_orig:
                where_new += " AND " + where_orig.strip()
            return f"UPDATE {m.group(1)} {m.group(2)} SET {set_clause} FROM ({m.group(3)}) {m.group(4)} WHERE {where_new};"
            
        content = re.sub(update_join_pattern, update_repl, content, flags=re.DOTALL)

    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)

os.makedirs('C:/Users/Usuario/Tupa/backend/database/postgresql', exist_ok=True)
convert_to_pg('C:/Users/Usuario/Tupa/backend/database/schema.sql', 'C:/Users/Usuario/Tupa/backend/database/postgresql/schema.sql', is_schema=True)
convert_to_pg('C:/Users/Usuario/Tupa/backend/database/catalogo_seed.sql', 'C:/Users/Usuario/Tupa/backend/database/postgresql/catalogo_seed.sql', is_schema=False)

import glob
os.makedirs('C:/Users/Usuario/Tupa/backend/database/postgresql/migrations', exist_ok=True)
for f in glob.glob('C:/Users/Usuario/Tupa/backend/migrations/*.sql'):
    out_f = os.path.join('C:/Users/Usuario/Tupa/backend/database/postgresql/migrations', os.path.basename(f))
    convert_to_pg(f, out_f, is_schema=False)
