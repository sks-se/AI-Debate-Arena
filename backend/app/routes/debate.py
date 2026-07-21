from fastapi import APIRouter

from app.models.debate import DebateRequest
from app.services.llm_service import ask_ai

router = APIRouter()

@router.post("/debate")
def debate(data: DebateRequest):

    reply = ask_ai(
        data.character,
        data.message
    )

    return {
        "character": data.character,
        "reply": reply
    }
