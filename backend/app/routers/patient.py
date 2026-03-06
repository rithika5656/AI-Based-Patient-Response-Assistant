"""Patient-facing API endpoints."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PatientQuery, DepartmentConfig, Department
from app.schemas import PatientQueryCreate, PatientQueryResponse
from app.services.gemini_service import generate_ai_response

router = APIRouter(prefix="/api/patient", tags=["Patient"])


def _get_current_department(db: Session) -> str:
    """Read the current department from config, defaulting to General."""
    config = db.query(DepartmentConfig).filter(DepartmentConfig.id == "singleton").first()
    if config:
        return config.department
    return Department.GENERAL.value


@router.post("/query", response_model=PatientQueryResponse)
async def submit_query(payload: PatientQueryCreate, db: Session = Depends(get_db)):
    """
    Step 1-7 of the workflow:
    • Receive the patient question
    • Store it in the database
    • Call Google Gemini AI to generate a draft response
    • Store the AI response and return it
    """
    # Get the current department setting
    department = _get_current_department(db)

    # Create the database record
    query = PatientQuery(
        patient_id=payload.patient_id,
        patient_name=payload.patient_name,
        question=payload.question,
        department=department,
    )
    db.add(query)
    db.commit()
    db.refresh(query)

    # Call AI with department context
    ai_text = await generate_ai_response(payload.question, department)

    # Persist the AI-generated response
    query.ai_response = ai_text
    db.commit()
    db.refresh(query)

    return query


@router.get("/query/{patient_id}", response_model=List[PatientQueryResponse])
def get_patient_queries(patient_id: str, db: Session = Depends(get_db)):
    """Return all queries (with responses) for a specific patient."""
    queries = (
        db.query(PatientQuery)
        .filter(PatientQuery.patient_id == patient_id)
        .order_by(PatientQuery.created_at.desc())
        .all()
    )
    if not queries:
        raise HTTPException(status_code=404, detail="No queries found for this patient.")
    return queries
