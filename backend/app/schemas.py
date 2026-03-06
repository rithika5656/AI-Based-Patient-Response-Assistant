from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────── Patient Schemas ────────────────────────────


class PatientQueryCreate(BaseModel):
    """Payload sent by the patient chatbot UI."""

    patient_id: str = Field(..., example="patient-001")
    patient_name: str = Field("Anonymous", example="John Doe")
    question: str = Field(..., example="What are the symptoms of diabetes?")


class PatientQueryResponse(BaseModel):
    """Single query object returned to the patient."""

    id: str
    patient_id: str
    patient_name: str
    question: str
    ai_response: Optional[str] = None
    doctor_response: Optional[str] = None
    department: Optional[str] = None
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ──────────────────────────── Doctor Schemas ─────────────────────────────


class DoctorReviewRequest(BaseModel):
    """Payload sent by the doctor when editing / approving a response."""

    doctor_response: str = Field(
        ...,
        example="Based on your symptoms, I recommend scheduling a check-up.",
    )


class DoctorQueryListItem(BaseModel):
    """Lightweight view used in the doctor's query list."""

    id: str
    patient_id: str
    patient_name: str
    question: str
    ai_response: Optional[str] = None
    department: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ────────────────────── Department Config Schemas ────────────────────────


class DepartmentConfigResponse(BaseModel):
    department: str

    class Config:
        from_attributes = True


class DepartmentConfigUpdate(BaseModel):
    department: str = Field(
        ..., example="General",
        description="One of: General, Billing, Scheduling, Medical Query",
    )
