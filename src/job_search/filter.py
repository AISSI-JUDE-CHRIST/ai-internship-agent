"""
Job filtering module based on user criteria
"""
from typing import List, Dict


class JobFilter:
    """Filter jobs based on user-defined criteria"""
    
    def __init__(self, filters: Dict):
        """
        Initialize filter with criteria
        
        Args:
            filters: Dictionary containing filter criteria
        """
        self.filters = filters
    
    def filter_jobs(self, jobs: List[Dict]) -> List[Dict]:
        """
        Filter a list of jobs based on criteria
        
        Args:
            jobs: List of job dictionaries
            
        Returns:
            Filtered list of jobs
        """
        filtered_jobs = []
        
        for job in jobs:
            if self._matches_criteria(job):
                filtered_jobs.append(job)
        
        return filtered_jobs
    
    def _matches_criteria(self, job: Dict) -> bool:
        """
        Check if a job matches all filter criteria
        
        Args:
            job: Job dictionary
            
        Returns:
            True if job matches all criteria, False otherwise
        """
        # Check salary range
        if self.filters.get('min_salary') or self.filters.get('max_salary'):
            salary = job.get('salary', 0)
            if self.filters.get('min_salary') and salary < self.filters['min_salary']:
                return False
            if self.filters.get('max_salary') and salary > self.filters['max_salary']:
                return False
        
        # Check job type
        if self.filters.get('job_types'):
            if job.get('job_type') not in self.filters['job_types']:
                return False
        
        # Check remote only
        if self.filters.get('remote_only') and not job.get('remote', False):
            return False
        
        # Check excluded keywords
        if self.filters.get('excluded_keywords'):
            job_text = f"{job.get('title', '')} {job.get('description', '')}".lower()
            for keyword in self.filters['excluded_keywords']:
                if keyword.lower() in job_text:
                    return False
        
        return True

