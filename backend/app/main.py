# app/main.py
from fastapi import FastAPI
from .api.trash import router as trash_router

app = FastAPI()
app.include_router(trash_router)
