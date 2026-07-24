from fastapi import APIRouter
from pydantic import BaseModel

from app.services.llm_service import ask_ai

router = APIRouter()


class IntroRequest(BaseModel):
    character: str


@router.post("/intro")
def intro(data: IntroRequest):

    reply = ask_ai(
    character=data.character,
    mode="intro"
)

    return {
        "intro": reply
    }
