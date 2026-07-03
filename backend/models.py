from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.orm import declarative_base
from datetime import datetime

DATABASE_URL = "postgresql://postgres:Sujan2005@localhost:5432/logpulse"

engine = create_engine(DATABASE_URL)

Base = declarative_base()

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String)
    message = Column(String)
    risk = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

print("Logs table created successfully!")