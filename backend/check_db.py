import psycopg2
try:
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='postgres',
        host='localhost',
        port='5432'
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT datname FROM pg_database;")
    dbs = [row[0] for row in cur.fetchall()]
    print("Databases:", [db for db in dbs if 'health' in db])
    
    cur.execute("SELECT rolname FROM pg_roles;")
    roles = [row[0] for row in cur.fetchall()]
    print("Roles:", [r for r in roles if 'health' in r])
    conn.close()
except Exception as e:
    print(f"Error: {e}")
