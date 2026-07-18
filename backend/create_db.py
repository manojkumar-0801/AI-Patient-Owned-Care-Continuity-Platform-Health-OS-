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
    cur.execute("SELECT 1 FROM pg_database WHERE datname='healthos_db'")
    exists = cur.fetchone()
    if not exists:
        cur.execute("CREATE DATABASE healthos_db")
        print("Database 'healthos_db' created successfully.")
    else:
        print("Database 'healthos_db' already exists.")
    conn.close()
    print("Done.")
except Exception as e:
    print(f"Error: {e}")
