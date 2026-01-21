"""
Job Search API Routes
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from backend.database.base import get_db
from backend.database.models import User, SearchCriteria, UserProfile
from backend.api.routes.auth import get_current_user
from backend.services.scraper_factory import ScraperFactory
from backend.services.job_matcher import JobMatcher
from backend.services.job_scraper import JobScraper
import json

router = APIRouter()


class JobSearchRequest(BaseModel):
    """Job search request model"""
    keywords: List[str]
    location: str
    max_results: Optional[int] = 50
    platforms: Optional[List[str]] = None


class JobFilter(BaseModel):
    """Job filter model"""
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    job_types: Optional[List[str]] = None
    remote_only: Optional[bool] = False
    required_skills: Optional[List[str]] = None
    excluded_keywords: Optional[List[str]] = None


class JobResponse(BaseModel):
    """Job response model"""
    id: str
    title: str
    company: str
    location: str
    description: str
    salary: Optional[str] = None
    job_type: Optional[str] = None
    remote: bool = False
    url: str
    platform: str
    posted_date: Optional[str] = None
    relevance_score: Optional[float] = None
    matched: Optional[bool] = None


@router.post("/search", response_model=List[JobResponse])
async def search_jobs(
    request: JobSearchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for jobs based on keywords and location, with relevance scoring
    """
    # Get user search criteria
    search_criteria = db.query(SearchCriteria).filter(
        SearchCriteria.user_id == current_user.id
    ).first()
    
    # Get user profile for matching
    user_profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    profile_data = {}
    if user_profile:
        profile_data = {
            'skills': json.loads(user_profile.skills) if user_profile.skills else [],
            'experience': json.loads(user_profile.experience) if user_profile.experience else [],
        }
    
    criteria_data = {}
    if search_criteria:
        criteria_data = {
            'location': search_criteria.location,
            'preferred_locations': json.loads(search_criteria.preferred_locations) if search_criteria.preferred_locations else [],
            'remote_only': search_criteria.remote_only,
            'job_type': search_criteria.job_type.value if search_criteria.job_type else None,
            'required_keywords': json.loads(search_criteria.required_keywords) if search_criteria.required_keywords else [],
            'excluded_keywords': json.loads(search_criteria.excluded_keywords) if search_criteria.excluded_keywords else [],
            'domain': search_criteria.domain,
            'platforms': json.loads(search_criteria.platforms) if search_criteria.platforms else [],
        }
    
    # Use request data or fallback to saved criteria
    keywords = request.keywords or []
    location = request.location or criteria_data.get('location', '')
    platforms = request.platforms or criteria_data.get('platforms', [])
    
    all_jobs = []
    
    # Search on each platform
    if not platforms:
        platforms = ['linkedin', 'indeed', 'hello_work', 'job_teaser', 'welcome_to_the_jungle']
    
    for platform in platforms:
        try:
            scraper = ScraperFactory.create_scraper(platform)
            jobs = scraper.search(keywords, location, request.max_results or 50)
            # Add platform info to each job
            for job in jobs:
                job['platform'] = platform
            all_jobs.extend(jobs)
        except Exception as e:
            # Log error but continue with other platforms
            print(f"Error searching on {platform}: {e}")
            continue
    
    # Match and score jobs
    matcher = JobMatcher(criteria_data, profile_data)
    matched_jobs = matcher.match_jobs(all_jobs)
    
    # Convert to response format
    result = []
    for job in matched_jobs:
        result.append({
            'id': job.get('id', ''),
            'title': job.get('title', ''),
            'company': job.get('company', ''),
            'location': job.get('location', ''),
            'description': job.get('description', ''),
            'salary': job.get('salary'),
            'job_type': job.get('job_type'),
            'remote': job.get('is_remote', False),
            'url': job.get('url', ''),
            'platform': job.get('platform', ''),
            'posted_date': job.get('posted_date'),
            'relevance_score': job.get('relevance_score', 0),
            'matched': job.get('matched', False),
        })
    
    return result


@router.post("/filter", response_model=List[JobResponse])
async def filter_jobs(jobs: List[JobResponse], filters: JobFilter):
    """
    Filter jobs based on criteria
    """
    # TODO: Implement filtering logic
    return []


@router.get("/{job_id}", response_model=JobResponse)
async def get_job_details(job_id: str):
    """
    Get detailed information about a specific job
    """
    # TODO: Implement job details retrieval
    raise HTTPException(status_code=404, detail="Job not found")

