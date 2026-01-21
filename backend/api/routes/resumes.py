"""
Resume Management API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from pathlib import Path

from backend.database.base import get_db
from backend.database.models import Resume, User
from backend.database.schemas import ResumeResponse, ResumeCreate, ResumeUpdate
from backend.api.routes.auth import get_current_user
from backend.services.pdf_extractor import PDFExtractor
from backend.services.ai_service import AIService
from backend.core.config import settings
import json
from loguru import logger

router = APIRouter()

# Configuration
UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".pdf"}


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format de fichier non autorisé. Formats acceptés: PDF"
        )
    
    # Note: File size validation should be done by FastAPI's file size limits
    # or by reading the file content and checking its size


@router.post("/upload", response_model=ResumeResponse, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    title: str = Form(...),
    is_default: bool = Form(False),
    extract_profile: bool = Form(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a new resume/CV and optionally extract profile information
    """
    # Validate file
    validate_file(file)
    
    # Read file content
    content = await file.read()
    
    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Le fichier est trop volumineux. Taille maximale: {MAX_FILE_SIZE / (1024*1024)} MB"
        )
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Extract text from PDF
    extracted_text = ""
    extracted_profile = None
    
    try:
        pdf_extractor = PDFExtractor()
        extracted_text = pdf_extractor.extract_text(str(file_path))
        logger.info(f"Extracted {len(extracted_text)} characters from PDF")
        
        # Extract profile using AI if requested
        if extract_profile and extracted_text and settings.OPENAI_API_KEY:
            try:
                ai_service = AIService(api_key=settings.OPENAI_API_KEY)
                extracted_profile = ai_service.extract_profile_from_resume(extracted_text)
                logger.info("Successfully extracted profile using AI")
            except Exception as e:
                logger.error(f"Error extracting profile with AI: {e}")
                extracted_profile = None
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        # Continue without extraction
    
    # If this is set as default, unset other defaults
    if is_default:
        db.query(Resume).filter(
            Resume.user_id == current_user.id,
            Resume.is_default == True
        ).update({"is_default": False})
    
    # Create resume record
    db_resume = Resume(
        user_id=current_user.id,
        title=title,
        file_path=str(file_path),
        is_default=is_default,
        content=extracted_text if extracted_text else None
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    # Prepare response with ResumeResponse model
    response = ResumeResponse.model_validate(db_resume)
    
    # Convert to dict and add extracted profile if available
    response_dict = response.model_dump()
    if extracted_profile:
        response_dict["extracted_profile"] = extracted_profile
    
    return response_dict


@router.get("/", response_model=List[ResumeResponse])
async def get_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all resumes for current user
    """
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.created_at.desc()).all()
    
    return resumes


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific resume
    """
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="CV non trouvé")
    
    return resume


@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a resume
    """
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="CV non trouvé")
    
    # If setting as default, unset other defaults
    if resume_data.is_default:
        db.query(Resume).filter(
            Resume.user_id == current_user.id,
            Resume.is_default == True,
            Resume.id != resume_id
        ).update({"is_default": False})
    
    # Update fields
    if resume_data.title is not None:
        resume.title = resume_data.title
    if resume_data.is_default is not None:
        resume.is_default = resume_data.is_default
    
    db.commit()
    db.refresh(resume)
    
    return resume


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a resume
    """
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="CV non trouvé")
    
    # Delete file if exists
    if resume.file_path and os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception as e:
            # Log error but continue with database deletion
            print(f"Error deleting file: {e}")
    
    db.delete(resume)
    db.commit()
    
    return {"message": "CV supprimé avec succès"}

