import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import bronze, silver, gold

load_dotenv()

app = FastAPI(title="DataFlow Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bronze.router, prefix="/bronze", tags=["bronze"])
app.include_router(silver.router, prefix="/silver", tags=["silver"])
app.include_router(gold.router, prefix="/gold", tags=["gold"])

@app.get("/")
def root():
    return {"status": "DataFlow Studio API running"}