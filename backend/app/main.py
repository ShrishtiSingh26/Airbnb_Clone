import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import ensure_schema
from app.config import load_backend_env

load_backend_env()

import app.models

from app.routers import (
    users,
    listings,
    bookings,
    reviews,
    wishlist,
    amenities,
    hosts,
    auth,
    payments,
)


from app.seed import seed_database

ensure_schema()
auth.ensure_demo_accounts()
try:
    seed_database()
except Exception as e:
    print(f"Auto-seed notification: {e}")


app = FastAPI(
    title="Airbnb Clone API",
    description="REST API for Airbnb Clone SDE Assignment",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(users.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(wishlist.router)
app.include_router(amenities.router)
app.include_router(hosts.router)
app.include_router(auth.router)
app.include_router(payments.router)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Airbnb Clone API is running",
        "status": "healthy",
    }
