from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import debate
from app.routes import intro

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(debate.router)
app.include_router(intro.router)


@app.get("/")
def home():
    return {"status": "Backend Running"}
