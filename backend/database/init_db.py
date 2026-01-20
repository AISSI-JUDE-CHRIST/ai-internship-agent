"""
Initialize database - Create all tables
"""
from backend.database.base import Base, engine
from backend.database import models


def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()

