"""
Job Matching Service - Calculate relevance scores for job listings
"""
from typing import Dict, List
from backend.database.models import JobListing, SearchCriteria, UserProfile


class JobMatcher:
    """Calculate relevance scores for job listings based on user criteria and profile"""
    
    def __init__(self, search_criteria: Dict, user_profile: Dict = None):
        """
        Initialize matcher with search criteria and optional user profile
        
        Args:
            search_criteria: Dictionary with search criteria
            user_profile: Optional user profile dictionary
        """
        self.criteria = search_criteria
        self.profile = user_profile or {}
    
    def calculate_relevance_score(self, job: Dict) -> float:
        """
        Calculate relevance score for a job (0-100)
        
        Args:
            job: Job dictionary
            
        Returns:
            Relevance score between 0 and 100
        """
        score = 0.0
        max_score = 100.0
        
        # Location match (20 points)
        if self.criteria.get('location'):
            job_location = (job.get('location') or '').lower()
            criteria_location = self.criteria['location'].lower()
            if criteria_location in job_location or job_location in criteria_location:
                score += 20
            elif self.criteria.get('preferred_locations'):
                for pref_loc in self.criteria['preferred_locations']:
                    if pref_loc.lower() in job_location:
                        score += 15
                        break
        
        # Remote match (10 points)
        if self.criteria.get('remote_only') and job.get('is_remote'):
            score += 10
        elif not self.criteria.get('remote_only') and job.get('is_remote'):
            score += 5
        
        # Job type match (15 points)
        if self.criteria.get('job_type'):
            if job.get('job_type') == self.criteria['job_type']:
                score += 15
        
        # Required keywords match (30 points)
        required_keywords = self.criteria.get('required_keywords', [])
        if required_keywords:
            job_text = f"{job.get('title', '')} {job.get('description', '')}".lower()
            matched_keywords = sum(1 for kw in required_keywords if kw.lower() in job_text)
            if matched_keywords > 0:
                score += (matched_keywords / len(required_keywords)) * 30
        
        # Excluded keywords penalty (-50 points)
        excluded_keywords = self.criteria.get('excluded_keywords', [])
        if excluded_keywords:
            job_text = f"{job.get('title', '')} {job.get('description', '')}".lower()
            for excluded_kw in excluded_keywords:
                if excluded_kw.lower() in job_text:
                    score -= 50
                    break
        
        # Domain match (15 points)
        if self.criteria.get('domain'):
            job_text = f"{job.get('title', '')} {job.get('description', '')}".lower()
            domain = self.criteria['domain'].lower()
            if domain in job_text:
                score += 15
        
        # Skills match from profile (10 points)
        if self.profile.get('skills'):
            job_text = f"{job.get('title', '')} {job.get('description', '')}".lower()
            profile_skills = self.profile['skills']
            if isinstance(profile_skills, str):
                # Try to parse JSON
                import json
                try:
                    profile_skills = json.loads(profile_skills)
                except:
                    profile_skills = [s.strip() for s in profile_skills.split(',')]
            
            matched_skills = sum(1 for skill in profile_skills if skill.lower() in job_text)
            if matched_skills > 0:
                score += min((matched_skills / len(profile_skills)) * 10, 10)
        
        # Ensure score is between 0 and 100
        score = max(0, min(score, max_score))
        
        return round(score, 1)
    
    def match_jobs(self, jobs: List[Dict]) -> List[Dict]:
        """
        Match and score a list of jobs
        
        Args:
            jobs: List of job dictionaries
            
        Returns:
            List of jobs with relevance scores, sorted by score descending
        """
        scored_jobs = []
        
        for job in jobs:
            score = self.calculate_relevance_score(job)
            job_with_score = {
                **job,
                'relevance_score': score,
                'matched': score >= 50  # Consider matched if score >= 50
            }
            scored_jobs.append(job_with_score)
        
        # Sort by relevance score descending
        scored_jobs.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return scored_jobs

