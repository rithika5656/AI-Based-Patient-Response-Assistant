"""Doctor dashboard API endpoints."""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PatientQuery, QueryStatus
from app.schemas import (
    DoctorQueryListItem,
    DoctorReviewRequest,
    PatientQueryResponse,
)

router = APIRouter(prefix="/api/doctor", tags=["Doctor"])


@router.get("/queries", response_model=List[DoctorQueryListItem])
def list_queries(status: str = None, db: Session = Depends(get_db)):
    """
    Step 8: List patient queries for the doctor dashboard.
    Optionally filter by status (pending, reviewed, delivered).
    """
    q = db.query(PatientQuery)
    if status:
        q = q.filter(PatientQuery.status == status)
    return q.order_by(PatientQuery.created_at.desc()).all()


@router.get("/query/{query_id}", response_model=PatientQueryResponse)
def get_query(query_id: str, db: Session = Depends(get_db)):
    """Return full details of a specific query including AI draft."""
    query = db.query(PatientQuery).filter(PatientQuery.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found.")
    return query


@router.put("/query/{query_id}", response_model=PatientQueryResponse)
def review_query(
    query_id: str,
    payload: DoctorReviewRequest,
    db: Session = Depends(get_db),
):
    """
    Steps 9-10: Doctor edits / approves the response.
    The final doctor_response is stored and status changes to REVIEWED,
    making it visible to the patient.
    """
    query = db.query(PatientQuery).filter(PatientQuery.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found.")

    query.doctor_response = payload.doctor_response
    query.status = QueryStatus.REVIEWED
    query.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(query)
    return query
