"""Doctor dashboard API endpoints."""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PatientQuery, QueryStatus, DepartmentConfig, Department
from app.schemas import (
    DoctorQueryListItem,
    DoctorReviewRequest,
    PatientQueryResponse,
    DepartmentConfigResponse,
    DepartmentConfigUpdate,
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


# ── Department Configuration ────────────────────────────────────────────

_VALID_DEPARTMENTS = {d.value for d in Department}


@router.get("/config/department", response_model=DepartmentConfigResponse)
def get_department_config(db: Session = Depends(get_db)):
    """Return the current department configuration."""
    config = db.query(DepartmentConfig).filter(DepartmentConfig.id == "singleton").first()
    if not config:
        config = DepartmentConfig(id="singleton", department=Department.GENERAL)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


@router.put("/config/department", response_model=DepartmentConfigResponse)
def update_department_config(
    payload: DepartmentConfigUpdate, db: Session = Depends(get_db)
):
    """Update the response department setting."""
    if payload.department not in _VALID_DEPARTMENTS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid department. Must be one of: {', '.join(sorted(_VALID_DEPARTMENTS))}",
        )
    config = db.query(DepartmentConfig).filter(DepartmentConfig.id == "singleton").first()
    if not config:
        config = DepartmentConfig(id="singleton", department=payload.department)
        db.add(config)
    else:
        config.department = payload.department
    db.commit()
    db.refresh(config)
    return config
