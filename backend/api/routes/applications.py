"""
Application Management API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from backend.database.base import get_db
from backend.database.models import Application, User, JobListing
from backend.api.routes.auth import get_current_user
from backend.database.schemas import ApplicationResponse, ApplicationCreate

router = APIRouter()


class ApplicationRequest(BaseModel):
    """Application request model"""
    job_listing_id: int
    resume_id: Optional[int] = None
    cover_letter: Optional[str] = None
    auto_generate_cover_letter: bool = True
    customize_resume: bool = True


@router.post("/", response_model=ApplicationResponse)
async def create_application(
    request: ApplicationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new job application
    """
    # TODO: Implement application creation
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/", response_model=List[ApplicationResponse])
async def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all applications for current user
    """
    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(Application.created_at.desc()).all()
    
    # Add job listing info to response
    result = []
    for app in applications:
        app_dict = ApplicationResponse.model_validate(app).dict()
        if app.job_listing:
            app_dict['job_title'] = app.job_listing.title
            app_dict['company'] = app.job_listing.company
        result.append(app_dict)
    
    return result


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific application
    """
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Candidature non trouvée")
    
    # Add job listing info
    app_dict = ApplicationResponse.model_validate(application).dict()
    if application.job_listing:
        app_dict['job_title'] = application.job_listing.title
        app_dict['company'] = application.job_listing.company
    
    return app_dict


@router.put("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: int,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an application
    """
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Candidature non trouvée")
    
    # Update fields
    if update_data.status:
        application.status = update_data.status
    
    if update_data.cover_letter is not None:
        application.cover_letter = update_data.cover_letter
    
    if update_data.notes is not None:
        application.notes = update_data.notes
    
    db.commit()
    db.refresh(application)
    
    # Add job listing info
    app_dict = ApplicationResponse.model_validate(application).dict()
    if application.job_listing:
        app_dict['job_title'] = application.job_listing.title
        app_dict['company'] = application.job_listing.company
    
    return app_dict


@router.post("/{application_id}/submit")
async def submit_application(application_id: str):
    """
    Submit an application
    """
    # TODO: Implement application submission
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.delete("/{application_id}")
async def delete_application(application_id: str):
    """
    Delete an application
    """
    # TODO: Implement application deletion
    raise HTTPException(status_code=501, detail="Not implemented yet")

