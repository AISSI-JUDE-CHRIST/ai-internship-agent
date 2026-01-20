"""
Database Models
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from backend.database.base import Base


class ApplicationStatus(str, enum.Enum):
    """Application status enumeration"""
    DRAFT = "draft"
    PENDING = "pending"
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    ACCEPTED = "accepted"


class JobType(str, enum.Enum):
    """Job type enumeration"""
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    TEMPORARY = "temporary"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class Platform(str, enum.Enum):
    """Job platform enumeration"""
    LINKEDIN = "linkedin"
    INDEED = "indeed"
    GLASSDOOR = "glassdoor"
    MONSTER = "monster"
    HELLO_WORK = "hello_work"
    JOB_TEASER = "job_teaser"
    WELCOME_TO_THE_JUNGLE = "welcome_to_the_jungle"
    OTHER = "other"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    search_history = relationship("JobSearchHistory", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    """Resume/CV model"""
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(String(500))  # Path to PDF/DOCX file
    content = Column(Text)  # Text content of resume
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")


class JobListing(Base):
    """Job listing model"""
    __tablename__ = "job_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(255), unique=True, index=True)  # ID from platform
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    location = Column(String(255))
    description = Column(Text)
    requirements = Column(Text)
    salary_min = Column(Float)
    salary_max = Column(Float)
    salary_currency = Column(String(10), default="USD")
    job_type = Column(SQLEnum(JobType))
    is_remote = Column(Boolean, default=False)
    platform = Column(SQLEnum(Platform), nullable=False)
    url = Column(String(500), nullable=False)
    posted_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    applications = relationship("Application", back_populates="job_listing")
    search_history = relationship("JobSearchHistory", back_populates="job_listing")


class Application(Base):
    """Job application model"""
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.DRAFT, nullable=False)
    
    # Application content
    cover_letter = Column(Text)
    cover_letter_path = Column(String(500))  # Path to cover letter file
    custom_resume_path = Column(String(500))  # Path to customized resume
    
    # AI generation info
    cover_letter_ai_generated = Column(Boolean, default=False)
    resume_customized = Column(Boolean, default=False)
    
    # Submission info
    submitted_at = Column(DateTime(timezone=True))
    submission_platform = Column(String(100))
    submission_confirmation = Column(String(500))
    
    # Notes
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="applications")
    job_listing = relationship("JobListing", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")


class CoverLetter(Base):
    """Cover letter template/model"""
    __tablename__ = "cover_letters"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"))
    title = Column(String(255))
    content = Column(Text, nullable=False)
    template_name = Column(String(100))
    is_template = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class JobSearchHistory(Base):
    """Job search history model"""
    __tablename__ = "job_search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id"))
    
    # Search parameters
    keywords = Column(String(500))
    location = Column(String(255))
    platform = Column(SQLEnum(Platform))
    
    # Search results
    total_results = Column(Integer, default=0)
    viewed = Column(Boolean, default=False)
    saved = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserProfile(Base):
    """Extended user profile information"""
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Professional info
    current_position = Column(String(255))
    current_company = Column(String(255))
    years_of_experience = Column(Integer)
    education = Column(Text)
    skills = Column(Text)  # JSON string or comma-separated
    languages = Column(Text)
    
    # Preferences
    preferred_job_types = Column(String(500))  # JSON array
    preferred_locations = Column(String(500))  # JSON array
    salary_expectation_min = Column(Float)
    salary_expectation_max = Column(Float)
    remote_preference = Column(Boolean, default=False)
    
    # Bio
    bio = Column(Text)
    linkedin_url = Column(String(500))
    github_url = Column(String(500))
    portfolio_url = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

