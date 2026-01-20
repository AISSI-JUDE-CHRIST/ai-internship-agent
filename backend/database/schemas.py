"""
Pydantic Schemas for API validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from backend.database.models import ApplicationStatus, JobType, Platform


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Resume Schemas
class ResumeBase(BaseModel):
    title: str
    is_default: bool = False


class ResumeCreate(ResumeBase):
    file_path: Optional[str] = None
    content: Optional[str] = None


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    file_path: Optional[str] = None
    content: Optional[str] = None
    is_default: Optional[bool] = None


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    file_path: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Job Listing Schemas
class JobListingBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    platform: Platform


class JobListingCreate(JobListingBase):
    external_id: Optional[str] = None
    requirements: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "USD"
    job_type: Optional[JobType] = None
    is_remote: bool = False
    url: str
    posted_date: Optional[datetime] = None


class JobListingResponse(JobListingBase):
    id: int
    external_id: Optional[str]
    salary_min: Optional[float]
    salary_max: Optional[float]
    salary_currency: str
    job_type: Optional[JobType]
    is_remote: bool
    url: str
    posted_date: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Application Schemas
class ApplicationBase(BaseModel):
    job_listing_id: int
    resume_id: Optional[int] = None


class ApplicationCreate(ApplicationBase):
    cover_letter: Optional[str] = None
    auto_generate_cover_letter: bool = True
    customize_resume: bool = True


class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    cover_letter: Optional[str] = None
    notes: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    status: ApplicationStatus
    cover_letter: Optional[str]
    cover_letter_path: Optional[str]
    custom_resume_path: Optional[str]
    cover_letter_ai_generated: bool
    resume_customized: bool
    submitted_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# User Profile Schemas
class UserProfileBase(BaseModel):
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    years_of_experience: Optional[int] = None
    education: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    preferred_job_types: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    salary_expectation_min: Optional[float] = None
    salary_expectation_max: Optional[float] = None
    remote_preference: bool = False


class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    preferred_job_types: Optional[str]
    preferred_locations: Optional[str]
    salary_expectation_min: Optional[float]
    salary_expectation_max: Optional[float]
    remote_preference: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

