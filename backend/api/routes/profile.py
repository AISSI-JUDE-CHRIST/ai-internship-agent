"""
User Profile API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import json

from backend.database.base import get_db
from backend.database.models import UserProfile, User, Resume
from backend.api.routes.auth import get_current_user
from backend.services.ai_service import AIService
from backend.core.config import settings

router = APIRouter()


def extract_profile_from_resume(resume_content: str) -> dict:
    """
    Extract profile information from resume using AI
    """
    ai_service = AIService(api_key=settings.OPENAI_API_KEY)
    
    prompt = f"""
    Extrait les informations suivantes de ce CV et retourne-les au format JSON:
    
    {{
        "personal_info": {{
            "first_name": "",
            "last_name": "",
            "email": "",
            "phone": "",
            "address": ""
        }},
        "summary": "",
        "experience": [
            {{
                "title": "",
                "company": "",
                "location": "",
                "start_date": "",
                "end_date": "",
                "description": "",
                "current": false
            }}
        ],
        "education": [
            {{
                "degree": "",
                "school": "",
                "field": "",
                "start_date": "",
                "end_date": "",
                "description": ""
            }}
        ],
        "skills": [],
        "languages": [
            {{
                "language": "",
                "level": ""
            }}
        ],
        "certifications": [
            {{
                "name": "",
                "issuer": "",
                "date": "",
                "expiry_date": ""
            }}
        ]
    }}
    
    CV:
    {resume_content}
    """
    
    # TODO: Implement actual AI extraction
    # For now, return empty structure
    return {
        "personal_info": {
            "first_name": "",
            "last_name": "",
            "email": "",
            "phone": "",
            "address": ""
        },
        "summary": "",
        "experience": [],
        "education": [],
        "skills": [],
        "languages": [],
        "certifications": []
    }


@router.post("/extract/{resume_id}")
async def extract_profile_from_resume_endpoint(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Extract profile information from a resume using AI
    """
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="CV non trouvé")
    
    # Read resume content (if stored as text)
    resume_content = resume.content or ""
    
    # Extract profile using AI
    extracted_data = extract_profile_from_resume(resume_content)
    
    # Get or create user profile
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
    
    # Update profile with extracted data
    if extracted_data.get("personal_info"):
        personal = extracted_data["personal_info"]
        profile.first_name = personal.get("first_name")
        profile.last_name = personal.get("last_name")
        profile.email = personal.get("email") or current_user.email
        profile.phone = personal.get("phone")
        profile.address = personal.get("address")
    
    profile.summary = extracted_data.get("summary", "")
    profile.education = json.dumps(extracted_data.get("education", []))
    profile.experience = json.dumps(extracted_data.get("experience", []))
    profile.skills = json.dumps(extracted_data.get("skills", []))
    profile.languages = json.dumps(extracted_data.get("languages", []))
    profile.certifications = json.dumps(extracted_data.get("certifications", []))
    profile.extracted_from_resume_id = resume_id
    
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profil extrait avec succès", "profile": profile}


@router.get("/", response_model=dict)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user profile
    """
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        # Return empty profile structure
        return {
            "personal_info": {
                "first_name": "",
                "last_name": "",
                "email": current_user.email,
                "phone": "",
                "address": ""
            },
            "summary": "",
            "experience": [],
            "education": [],
            "skills": [],
            "languages": [],
            "certifications": []
        }
    
    # Parse JSON fields
    return {
        "id": profile.id,
        "personal_info": {
            "first_name": profile.first_name or "",
            "last_name": profile.last_name or "",
            "email": profile.email or current_user.email,
            "phone": profile.phone or "",
            "address": profile.address or ""
        },
        "summary": profile.summary or "",
        "experience": json.loads(profile.experience) if profile.experience else [],
        "education": json.loads(profile.education) if profile.education else [],
        "skills": json.loads(profile.skills) if profile.skills else [],
        "languages": json.loads(profile.languages) if profile.languages else [],
        "certifications": json.loads(profile.certifications) if profile.certifications else [],
    }


@router.put("/", response_model=dict)
async def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile
    """
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
    
    # Update personal info
    if "personal_info" in profile_data:
        personal = profile_data["personal_info"]
        profile.first_name = personal.get("first_name")
        profile.last_name = personal.get("last_name")
        profile.email = personal.get("email")
        profile.phone = personal.get("phone")
        profile.address = personal.get("address")
    
    # Update other fields
    if "summary" in profile_data:
        profile.summary = profile_data["summary"]
    
    if "experience" in profile_data:
        profile.experience = json.dumps(profile_data["experience"])
    
    if "education" in profile_data:
        profile.education = json.dumps(profile_data["education"])
    
    if "skills" in profile_data:
        profile.skills = json.dumps(profile_data["skills"])
    
    if "languages" in profile_data:
        profile.languages = json.dumps(profile_data["languages"])
    
    if "certifications" in profile_data:
        profile.certifications = json.dumps(profile_data["certifications"])
    
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Profil mis à jour avec succès",
        "profile": {
            "id": profile.id,
            "personal_info": {
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "email": profile.email,
                "phone": profile.phone,
                "address": profile.address
            },
            "summary": profile.summary,
            "experience": json.loads(profile.experience) if profile.experience else [],
            "education": json.loads(profile.education) if profile.education else [],
            "skills": json.loads(profile.skills) if profile.skills else [],
            "languages": json.loads(profile.languages) if profile.languages else [],
            "certifications": json.loads(profile.certifications) if profile.certifications else [],
        }
    }

