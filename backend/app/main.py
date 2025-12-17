from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Truth Meter API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.models import init_db
from app.routers import questions, evaluations, analytics, model_info

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(questions.router)
app.include_router(evaluations.router)
app.include_router(analytics.router)
app.include_router(model_info.router)

@app.get("/")
async def root():
    return {"message": "AI Truth Meter API is running"}
