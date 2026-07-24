from pydantic import BaseModel, Field

class JudgeRequest(BaseModel):
    character: str = Field(..., description="Character ID (e.g. chanakya)")
    player_argument: str = Field(..., min_length=1)
    ai_argument: str = Field(..., min_length=1)


class JudgeResponse(BaseModel):
    logic: int = Field(..., ge=0, le=10)
    evidence: int = Field(..., ge=0, le=10)
    relevance: int = Field(..., ge=0, le=10)
    clarity: int = Field(..., ge=0, le=10)
    persuasiveness: int = Field(..., ge=0, le=10)

    overall: int = Field(..., ge=0, le=10)

    damage: int = Field(..., ge=0)
    xp: int = Field(..., ge=0)

    winner: str = Field(..., description="player | opponent | draw")

    feedback: str

    fallacy: str | None = None
    achievement: str | None = None
