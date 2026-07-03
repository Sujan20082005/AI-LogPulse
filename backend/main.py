from fastapi.middleware.cors import CORSMiddleware
from ml.anomaly_detector import detect_anomaly
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "postgresql://postgres:Sujan2005@localhost:5432/logpulse"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String)
    message = Column(String)
    risk = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LogRequest(BaseModel):
    level: str
    message: str

@app.get("/")
def home():
    return {
        "message": "AI LogPulse Backend Running"
    }

@app.post("/logs")
def create_log(log: LogRequest):
    db = SessionLocal()

    risk = detect_anomaly(log.level)

    new_log = Log(
        level=log.level,
        message=log.message,
        risk=risk
    )

    db.add(new_log)
    db.commit()

    return {
        "status": "success",
        "message": "Log stored successfully",
        "risk": risk
    }

@app.get("/logs")
def get_logs():
    db = SessionLocal()

    logs = db.query(Log).all()

    result = []

    for log in logs:
        result.append({
            "id": log.id,
            "level": log.level,
            "message": log.message,
            "risk": log.risk,
            "timestamp": str(log.timestamp)
        })

    return result

@app.get("/dashboard")
def dashboard():
    db = SessionLocal()

    logs = db.query(Log).all()

    total_logs = len(logs)
    error_logs = len([log for log in logs if log.level == "ERROR"])
    warning_logs = len([log for log in logs if log.level == "WARNING"])
    info_logs = len([log for log in logs if log.level == "INFO"])

    db.close()

    return {
        "total_logs": total_logs,
        "error_logs": error_logs,
        "warning_logs": warning_logs,
        "info_logs": info_logs,
    }
@app.get("/dashboard/errors")
def critical_errors():
    db = SessionLocal()

    try:
        logs = db.query(Log).filter(Log.risk == "CRITICAL").all()

        result = []

        for log in logs:
            result.append({
                "id": log.id,
                "message": log.message,
                "risk": log.risk,
                "timestamp": str(log.timestamp) if log.timestamp else ""
            })

        return result

    finally:
        db.close()