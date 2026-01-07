from fastapi import FastAPI

from app.db.session import engine
from app.db.base import Base

# IMPORTANT: import ALL models so SQLAlchemy registers tables
from app.models import user, case, audit, dca

# Create FastAPI app FIRST
app = FastAPI(
    title="Fedx DCA Platform",
    version="1.0"
)

# Import and register routes AFTER app creation
from app.api.routes import cases, auth, dca, audit

app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(dca.router)
app.include_router(audit.router)

# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    return {"status": "ok"}
