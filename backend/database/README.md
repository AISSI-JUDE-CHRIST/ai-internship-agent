# Database Schema Documentation

## Database Choice

This project uses **PostgreSQL** as the primary database (recommended for production) but also supports **SQLite** for development.

### Why PostgreSQL?

- **Robust**: Enterprise-grade relational database
- **Scalable**: Handles large datasets efficiently
- **ACID Compliance**: Ensures data integrity
- **Rich Features**: JSON support, full-text search, advanced indexing
- **Production Ready**: Used by major applications worldwide

### SQLite Support

SQLite is supported for local development and testing. Simply set `DATABASE_URL=sqlite:///./job_agent.db` in your `.env` file.

## Schema Overview

The database consists of 7 main tables:

1. **users** - User accounts and authentication
2. **resumes** - User CVs/resumes
3. **job_listings** - Job offers from various platforms
4. **applications** - Job applications submitted by users
5. **cover_letters** - Cover letter templates and generated letters
6. **job_search_history** - History of job searches
7. **user_profiles** - Extended user profile information

## Entity Relationship Diagram

```
users
  ├── resumes (1:N)
  ├── applications (1:N)
  ├── job_search_history (1:N)
  └── user_profiles (1:1)

job_listings
  ├── applications (1:N)
  └── job_search_history (1:N)

applications
  ├── users (N:1)
  ├── job_listings (N:1)
  └── resumes (N:1)

cover_letters
  ├── users (N:1)
  └── applications (N:1)
```

## Tables Details

### users
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| email | String(255) | Unique email address |
| username | String(100) | Unique username |
| hashed_password | String(255) | Hashed password |
| full_name | String(255) | User's full name |
| phone | String(20) | Phone number |
| is_active | Boolean | Account active status |
| is_superuser | Boolean | Admin privileges |
| created_at | DateTime | Account creation date |
| updated_at | DateTime | Last update date |

### resumes
Stores user CVs/resumes.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | Integer | Foreign key to users |
| title | String(255) | Resume title/name |
| file_path | String(500) | Path to PDF/DOCX file |
| content | Text | Text content of resume |
| is_default | Boolean | Default resume flag |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last update date |

### job_listings
Stores job offers from various platforms.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| external_id | String(255) | Platform-specific ID |
| title | String(255) | Job title |
| company | String(255) | Company name |
| location | String(255) | Job location |
| description | Text | Full job description |
| requirements | Text | Job requirements |
| salary_min | Float | Minimum salary |
| salary_max | Float | Maximum salary |
| salary_currency | String(10) | Currency code (USD, EUR, etc.) |
| job_type | Enum | full-time, part-time, contract, etc. |
| is_remote | Boolean | Remote work available |
| platform | Enum | linkedin, indeed, glassdoor, etc. |
| url | String(500) | Job posting URL |
| posted_date | DateTime | When job was posted |
| expiry_date | DateTime | Job expiry date |
| is_active | Boolean | Job still active |
| created_at | DateTime | Record creation date |
| updated_at | DateTime | Last update date |

### applications
Stores job applications.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | Integer | Foreign key to users |
| job_listing_id | Integer | Foreign key to job_listings |
| resume_id | Integer | Foreign key to resumes |
| status | Enum | draft, pending, submitted, etc. |
| cover_letter | Text | Cover letter content |
| cover_letter_path | String(500) | Path to cover letter file |
| custom_resume_path | String(500) | Path to customized resume |
| cover_letter_ai_generated | Boolean | AI-generated flag |
| resume_customized | Boolean | Resume customized flag |
| submitted_at | DateTime | Submission timestamp |
| submission_platform | String(100) | Platform used for submission |
| submission_confirmation | String(500) | Confirmation code/message |
| notes | Text | User notes |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last update date |

### cover_letters
Stores cover letter templates and generated letters.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | Integer | Foreign key to users |
| application_id | Integer | Foreign key to applications (optional) |
| title | String(255) | Letter title |
| content | Text | Letter content |
| template_name | String(100) | Template name if template |
| is_template | Boolean | Is a template |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last update date |

### job_search_history
Tracks job search history.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | Integer | Foreign key to users |
| job_listing_id | Integer | Foreign key to job_listings |
| keywords | String(500) | Search keywords used |
| location | String(255) | Search location |
| platform | Enum | Platform searched |
| total_results | Integer | Number of results |
| viewed | Boolean | Job was viewed |
| saved | Boolean | Job was saved |
| created_at | DateTime | Search date |

### user_profiles
Extended user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | Integer | Foreign key to users (unique) |
| current_position | String(255) | Current job title |
| current_company | String(255) | Current company |
| years_of_experience | Integer | Years of experience |
| education | Text | Education background |
| skills | Text | Skills (JSON or comma-separated) |
| languages | Text | Languages spoken |
| preferred_job_types | String(500) | Preferred job types (JSON) |
| preferred_locations | String(500) | Preferred locations (JSON) |
| salary_expectation_min | Float | Minimum salary expectation |
| salary_expectation_max | Float | Maximum salary expectation |
| remote_preference | Boolean | Prefers remote work |
| bio | Text | User biography |
| linkedin_url | String(500) | LinkedIn profile URL |
| github_url | String(500) | GitHub profile URL |
| portfolio_url | String(500) | Portfolio URL |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last update date |

## Enumerations

### ApplicationStatus
- `draft` - Application not yet submitted
- `pending` - Application ready to submit
- `submitted` - Application submitted
- `reviewed` - Application under review
- `interview` - Interview scheduled
- `rejected` - Application rejected
- `accepted` - Application accepted

### JobType
- `full-time` - Full-time position
- `part-time` - Part-time position
- `contract` - Contract position
- `temporary` - Temporary position
- `internship` - Internship
- `freelance` - Freelance work

### Platform
- `linkedin` - LinkedIn
- `indeed` - Indeed
- `glassdoor` - Glassdoor
- `monster` - Monster
- `hello_work` - Hello Work (Pôle Emploi)
- `job_teaser` - Job Teaser
- `welcome_to_the_jungle` - Welcome to the Jungle
- `other` - Other platform

## Migrations

This project uses **Alembic** for database migrations.

### Initial Setup

1. Create initial migration:
```bash
cd backend
alembic revision --autogenerate -m "Initial migration"
```

2. Apply migrations:
```bash
alembic upgrade head
```

### Creating New Migrations

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Create empty migration
alembic revision -m "Description of changes"
```

### Applying Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade <revision>

# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision>
```

## Database Connection

The database connection is configured in `backend/core/config.py` via the `DATABASE_URL` environment variable.

### PostgreSQL Connection String Format
```
postgresql://username:password@host:port/database
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/job_agent
```

### SQLite Connection String Format
```
sqlite:///./path/to/database.db
```

Example:
```
sqlite:///./job_agent.db
```

## Indexes

The following indexes are automatically created:

- `users.email` - Unique index
- `users.username` - Unique index
- `job_listings.external_id` - Unique index
- `job_listings.title` - Index for search
- `job_listings.company` - Index for search

Additional indexes can be added in migrations as needed for performance optimization.

