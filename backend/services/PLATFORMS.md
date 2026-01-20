# Supported Job Platforms

This document describes all the job platforms supported by the AI Job Application Agent.

## Platform List

### 1. LinkedIn
- **URL**: https://www.linkedin.com/jobs
- **Description**: Professional networking platform with extensive job listings
- **Coverage**: Global
- **Features**: 
  - Professional profiles
  - Company pages
  - Salary insights
  - Easy application process

### 2. Indeed
- **URL**: https://www.indeed.com
- **Description**: One of the largest job search engines globally
- **Coverage**: Global (multiple countries)
- **Features**:
  - Aggregates jobs from multiple sources
  - Resume upload
  - Company reviews
  - Salary information

### 3. Glassdoor
- **URL**: https://www.glassdoor.com/Job
- **Description**: Job search platform with company reviews and salary data
- **Coverage**: Global
- **Features**:
  - Company reviews
  - Salary transparency
  - Interview insights
  - Company ratings

### 4. Hello Work (Pôle Emploi)
- **URL**: https://www.hellowork.com
- **Description**: Official French job platform (Pôle Emploi)
- **Coverage**: France
- **Features**:
  - Official French job listings
  - Government-backed platform
  - Free for job seekers
  - CV database

### 5. Job Teaser
- **URL**: https://www.jobteaser.com
- **Description**: Job platform focused on students and young professionals
- **Coverage**: Europe (primarily France)
- **Features**:
  - Internships and entry-level positions
  - Student-focused
  - Career advice
  - Company events

### 6. Welcome to the Jungle
- **URL**: https://www.welcometothejungle.com
- **Description**: Modern job platform with focus on company culture
- **Coverage**: France, Europe
- **Features**:
  - Company culture insights
  - Modern UI/UX
  - Startup and tech focus
  - Video job descriptions

## Platform-Specific Considerations

### Authentication
Some platforms may require:
- **LinkedIn**: Account login (OAuth recommended)
- **Hello Work**: Pôle Emploi account
- **Job Teaser**: Student/graduate account
- **Welcome to the Jungle**: Account creation

### Rate Limiting
Be aware of rate limits:
- **LinkedIn**: Strict rate limits, use official API when possible
- **Indeed**: Respect robots.txt and rate limits
- **Glassdoor**: May require authentication for some features
- **Hello Work**: Official platform, follow terms of service
- **Job Teaser**: Student platform, respect usage policies
- **Welcome to the Jungle**: Modern platform, check API availability

### Legal Considerations
- Always respect robots.txt
- Follow terms of service for each platform
- Consider using official APIs when available
- Implement delays between requests
- Use proper User-Agent headers

## Implementation Status

| Platform | Scraper Status | API Available | Notes |
|----------|---------------|---------------|-------|
| LinkedIn | Planned | Yes (LinkedIn API) | Requires OAuth |
| Indeed | Planned | Limited | Web scraping |
| Glassdoor | Planned | No | Web scraping |
| Hello Work | Planned | Unknown | Check official API |
| Job Teaser | Planned | Unknown | Check official API |
| Welcome to the Jungle | Planned | Unknown | Check official API |

## Adding New Platforms

To add a new platform:

1. Add platform to `Platform` enum in `backend/database/models.py`
2. Create scraper class in `backend/services/job_scraper.py`
3. Register scraper in `backend/services/scraper_factory.py`
4. Update `JOB_SEARCH_PLATFORMS` in `backend/core/config.py`
5. Update this documentation

## Usage Example

```python
from backend.services.scraper_factory import ScraperFactory

# Create scraper for a specific platform
scraper = ScraperFactory.create_scraper("welcome_to_the_jungle")

# Search for jobs
jobs = scraper.search(
    keywords=["développeur", "python"],
    location="Paris",
    max_results=50
)
```

