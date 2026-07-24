from fastapi import APIRouter, HTTPException

from app.models.debate import DebateRequest
from app.services.debate_service import run_debate

router = APIRouter()


@router.post("/debate")
def debate(data: DebateRequest):
    try:
        return run_debate(data)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
