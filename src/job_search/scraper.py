"""
Web scraper for job search platforms
"""
from typing import List, Dict
import requests
from bs4 import BeautifulSoup


class JobScraper:
    """Base class for job scrapers"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def search_jobs(self, keywords: List[str], location: str, max_results: int = 50) -> List[Dict]:
        """
        Search for jobs based on keywords and location
        
        Args:
            keywords: List of search keywords
            location: Job location
            max_results: Maximum number of results to return
            
        Returns:
            List of job dictionaries
        """
        raise NotImplementedError("Subclasses must implement search_jobs method")
    
    def parse_job_listing(self, html: str) -> Dict:
        """
        Parse a single job listing from HTML
        
        Args:
            html: HTML content of job listing
            
        Returns:
            Dictionary containing job information
        """
        raise NotImplementedError("Subclasses must implement parse_job_listing method")

