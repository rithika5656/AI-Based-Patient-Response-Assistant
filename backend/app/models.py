import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, DateTime, Enum
import enum

from app.database import Base


class QueryStatus(str, enum.Enum):
    PENDING = "pending"          # AI response generated, waiting for doctor
    REVIEWED = "reviewed"        # Doctor has approved / edited the response
    DELIVERED = "delivered"      # Final response sent to patient


class PatientQuery(Base):
    """Represents a single patient question and its lifecycle."""

    __tablename__ = "patient_queries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, nullable=False, index=True)
    patient_name = Column(String, nullable=False, default="Anonymous")
    question = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=True)
    doctor_response = Column(Text, nullable=True)
    status = Column(
        Enum(QueryStatus), nullable=False, default=QueryStatus.PENDING
    )
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    reviewed_at = Column(DateTime, nullable=True)
