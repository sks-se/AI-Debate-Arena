from app.models.debate import DebateRequest
from app.models.judge import JudgeRequest
from app.services.llm_service import ask_ai
from app.services.judge_service import judge_debate


def run_debate(data: DebateRequest) -> dict:

    ai_reply = ask_ai(
        character=data.character,
        message=data.message,
        mode="debate"
    )

    judge_result = judge_debate(

        JudgeRequest(

            character=data.character,

            player_argument=data.message,

            ai_argument=ai_reply

        )

    )

    return {

        "reply": ai_reply,

        "judge": judge_result.model_dump()

    }
