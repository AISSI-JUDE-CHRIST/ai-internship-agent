"""
Search Criteria API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
import json

from backend.database.base import get_db
from backend.database.models import SearchCriteria, User
from backend.database.models import JobType, Platform
from backend.api.routes.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=dict)
async def get_search_criteria(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get search criteria for current user
    """
    criteria = db.query(SearchCriteria).filter(
        SearchCriteria.user_id == current_user.id
    ).first()
    
    if not criteria:
        # Return default empty structure
        return {
            "domain": "",
            "sectors": [],
            "location": "",
            "preferred_locations": [],
            "remote_only": False,
            "job_type": None,
            "internship_duration": "",
            "required_keywords": [],
            "excluded_keywords": [],
            "preferred_start_date": None,
            "earliest_start_date": None,
            "latest_start_date": None,
            "min_salary": None,
            "max_salary": None,
            "salary_currency": "EUR",
            "platforms": [],
            "min_experience_years": None,
            "max_experience_years": None,
        }
    
    return {
        "id": criteria.id,
        "domain": criteria.domain or "",
        "sectors": json.loads(criteria.sectors) if criteria.sectors else [],
        "location": criteria.location or "",
        "preferred_locations": json.loads(criteria.preferred_locations) if criteria.preferred_locations else [],
        "remote_only": criteria.remote_only,
        "job_type": criteria.job_type.value if criteria.job_type else None,
        "internship_duration": criteria.internship_duration or "",
        "required_keywords": json.loads(criteria.required_keywords) if criteria.required_keywords else [],
        "excluded_keywords": json.loads(criteria.excluded_keywords) if criteria.excluded_keywords else [],
        "preferred_start_date": criteria.preferred_start_date.isoformat() if criteria.preferred_start_date else None,
        "earliest_start_date": criteria.earliest_start_date.isoformat() if criteria.earliest_start_date else None,
        "latest_start_date": criteria.latest_start_date.isoformat() if criteria.latest_start_date else None,
        "min_salary": criteria.min_salary,
        "max_salary": criteria.max_salary,
        "salary_currency": criteria.salary_currency or "EUR",
        "platforms": json.loads(criteria.platforms) if criteria.platforms else [],
        "min_experience_years": criteria.min_experience_years,
        "max_experience_years": criteria.max_experience_years,
    }


@router.put("/", response_model=dict)
async def update_search_criteria(
    criteria_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update search criteria for current user
    """
    criteria = db.query(SearchCriteria).filter(
        SearchCriteria.user_id == current_user.id
    ).first()
    
    if not criteria:
        criteria = SearchCriteria(user_id=current_user.id)
        db.add(criteria)
    
    # Update fields
    if "domain" in criteria_data:
        criteria.domain = criteria_data.get("domain")
    
    if "sectors" in criteria_data:
        criteria.sectors = json.dumps(criteria_data["sectors"]) if criteria_data["sectors"] else None
    
    if "location" in criteria_data:
        criteria.location = criteria_data.get("location")
    
    if "preferred_locations" in criteria_data:
        criteria.preferred_locations = json.dumps(criteria_data["preferred_locations"]) if criteria_data["preferred_locations"] else None
    
    if "remote_only" in criteria_data:
        criteria.remote_only = criteria_data.get("remote_only", False)
    
    if "job_type" in criteria_data:
        job_type_value = criteria_data.get("job_type")
        criteria.job_type = JobType(job_type_value) if job_type_value else None
    
    if "internship_duration" in criteria_data:
        criteria.internship_duration = criteria_data.get("internship_duration")
    
    if "required_keywords" in criteria_data:
        criteria.required_keywords = json.dumps(criteria_data["required_keywords"]) if criteria_data["required_keywords"] else None
    
    if "excluded_keywords" in criteria_data:
        criteria.excluded_keywords = json.dumps(criteria_data["excluded_keywords"]) if criteria_data["excluded_keywords"] else None
    
    if "preferred_start_date" in criteria_data:
        preferred_date = criteria_data.get("preferred_start_date")
        criteria.preferred_start_date = datetime.fromisoformat(preferred_date) if preferred_date else None
    
    if "earliest_start_date" in criteria_data:
        earliest_date = criteria_data.get("earliest_start_date")
        criteria.earliest_start_date = datetime.fromisoformat(earliest_date) if earliest_date else None
    
    if "latest_start_date" in criteria_data:
        latest_date = criteria_data.get("latest_start_date")
        criteria.latest_start_date = datetime.fromisoformat(latest_date) if latest_date else None
    
    if "min_salary" in criteria_data:
        criteria.min_salary = criteria_data.get("min_salary")
    
    if "max_salary" in criteria_data:
        criteria.max_salary = criteria_data.get("max_salary")
    
    if "salary_currency" in criteria_data:
        criteria.salary_currency = criteria_data.get("salary_currency", "EUR")
    
    if "platforms" in criteria_data:
        criteria.platforms = json.dumps(criteria_data["platforms"]) if criteria_data["platforms"] else None
    
    if "min_experience_years" in criteria_data:
        criteria.min_experience_years = criteria_data.get("min_experience_years")
    
    if "max_experience_years" in criteria_data:
        criteria.max_experience_years = criteria_data.get("max_experience_years")
    
    db.commit()
    db.refresh(criteria)
    
    return {
        "message": "Critères de recherche mis à jour avec succès",
        "criteria": {
            "id": criteria.id,
            "domain": criteria.domain,
            "sectors": json.loads(criteria.sectors) if criteria.sectors else [],
            "location": criteria.location,
            "preferred_locations": json.loads(criteria.preferred_locations) if criteria.preferred_locations else [],
            "remote_only": criteria.remote_only,
            "job_type": criteria.job_type.value if criteria.job_type else None,
            "internship_duration": criteria.internship_duration,
            "required_keywords": json.loads(criteria.required_keywords) if criteria.required_keywords else [],
            "excluded_keywords": json.loads(criteria.excluded_keywords) if criteria.excluded_keywords else [],
        }
    }

