from fastapi import FastAPI

app = FastAPI(
    title="AI Debate Escape Arena API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "status": "Backend Running 🚀",
        "message": "Welcome to AI Debate Escape Arena API"
    }
