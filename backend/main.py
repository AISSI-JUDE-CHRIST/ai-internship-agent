"""
FastAPI Backend - Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.routes import jobs, applications, ai, auth, stats, resumes, profile, search_criteria
from backend.core.config import settings

app = FastAPI(
    title="AI Job Application Agent API",
    description="Backend API for automated job application agent",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(stats.router, prefix="/api/stats", tags=["statistics"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["resumes"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(search_criteria.router, prefix="/api/search-criteria", tags=["search-criteria"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])


@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse({
        "message": "AI Job Application Agent API",
        "version": "1.0.0",
        "status": "running"
    })


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({"status": "healthy"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )

