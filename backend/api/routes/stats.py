"""
Statistics API Routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Dict

from backend.database.base import get_db
from backend.database.models import Application, ApplicationStatus, User
from backend.api.routes.auth import get_current_user

router = APIRouter()


@router.get("/applications")
async def get_application_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get application statistics for current user
    """
    # Get all applications for user
    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()
    
    total = len(applications)
    
    # Count by status
    status_counts = {}
    for status in ApplicationStatus:
        count = len([app for app in applications if app.status == status])
        status_counts[status.value] = count
    
    # Calculate metrics
    submitted = status_counts.get('submitted', 0)
    pending = (
        status_counts.get('draft', 0) +
        status_counts.get('pending', 0) +
        status_counts.get('submitted', 0) +
        status_counts.get('reviewed', 0)
    )
    accepted = status_counts.get('accepted', 0)
    rejected = status_counts.get('rejected', 0)
    
    responded = accepted + rejected
    response_rate = round((responded / total * 100) if total > 0 else 0, 1)
    acceptance_rate = round((accepted / total * 100) if total > 0 else 0, 1)
    
    return {
        "total": total,
        "submitted": submitted,
        "pending": pending,
        "accepted": accepted,
        "rejected": rejected,
        "response_rate": response_rate,
        "acceptance_rate": acceptance_rate,
        "status_counts": status_counts,
    }

