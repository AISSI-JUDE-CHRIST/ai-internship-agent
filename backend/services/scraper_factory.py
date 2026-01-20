"""
Scraper Factory - Creates appropriate scraper based on platform
"""
from typing import Dict
from backend.services.job_scraper import (
    JobScraper,
    LinkedInScraper,
    IndeedScraper,
    GlassdoorScraper,
    HelloWorkScraper,
    JobTeaserScraper,
    WelcomeToTheJungleScraper
)
from backend.database.models import Platform


class ScraperFactory:
    """Factory to create platform-specific scrapers"""
    
    _scrapers: Dict[str, type] = {
        Platform.LINKEDIN.value: LinkedInScraper,
        Platform.INDEED.value: IndeedScraper,
        Platform.GLASSDOOR.value: GlassdoorScraper,
        Platform.HELLO_WORK.value: HelloWorkScraper,
        Platform.JOB_TEASER.value: JobTeaserScraper,
        Platform.WELCOME_TO_THE_JUNGLE.value: WelcomeToTheJungleScraper,
    }
    
    @classmethod
    def create_scraper(cls, platform: str) -> JobScraper:
        """
        Create a scraper instance for the specified platform
        
        Args:
            platform: Platform name (e.g., 'linkedin', 'indeed', 'hello_work')
            
        Returns:
            JobScraper instance
            
        Raises:
            ValueError: If platform is not supported
        """
        platform_lower = platform.lower()
        
        if platform_lower not in cls._scrapers:
            raise ValueError(f"Unsupported platform: {platform}. Supported platforms: {list(cls._scrapers.keys())}")
        
        scraper_class = cls._scrapers[platform_lower]
        return scraper_class()
    
    @classmethod
    def get_supported_platforms(cls) -> list:
        """Get list of supported platforms"""
        return list(cls._scrapers.keys())
    
    @classmethod
    def is_platform_supported(cls, platform: str) -> bool:
        """Check if a platform is supported"""
        return platform.lower() in cls._scrapers

