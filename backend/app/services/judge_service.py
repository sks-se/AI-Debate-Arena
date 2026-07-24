import json
import os

from dotenv import load_dotenv
from openai import OpenAI

from app.models.judge import JudgeRequest, JudgeResponse

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)


def load_judge_prompt() -> str:
    """
    Load the Judge AI system prompt.
    """

    prompt_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "judges",
        "judge_prompt.txt"
    )

    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()


def judge_debate(data: JudgeRequest) -> JudgeResponse:
    """
    Evaluate the debate between the player and the AI.
    """

    system_prompt = load_judge_prompt()

    user_prompt = f"""

Opponent:
{data.character}

Player's Argument:
{data.player_argument}

Opponent's Argument:
{data.ai_argument}

Evaluate both arguments.

Return ONLY valid JSON.
"""

    response = client.chat.completions.create(
        model="openai/gpt-4.1-mini",

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],

        temperature=0,
        max_tokens=300,
    )

    result = response.choices[0].message.content.strip()

    try:
        parsed = json.loads(result)

    except json.JSONDecodeError:
        raise ValueError(
            "Judge AI returned invalid JSON.\n\n"
            f"Response:\n{result}"
        )

    return JudgeResponse(**parsed)
