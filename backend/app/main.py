# app/main.py
from fastapi import FastAPI
from .api.trash import router as trash_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(trash_router)

# CORS configuration to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
