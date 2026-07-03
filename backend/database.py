from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:Sujan2005@localhost:5432/logpulse"

engine = create_engine(DATABASE_URL)

try:
    connection = engine.connect()
    print("Database Connected Successfully!")
    connection.close()
except Exception as e:
    print("Connection Failed:", e)