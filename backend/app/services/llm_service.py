import os

from dotenv import load_dotenv
from openai import OpenAI
from app.utils.prompt_loader import *
from app.utils.prompt_loader import load_prompt

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

def ask_ai(character: str, message: str):

    system_prompt = load_prompt(character)

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {
                "role":"system",
                "content":system_prompt
            },
            {
                "role":"user",
                "content":message
            }
        ]
    )

    return response.choices[0].message.content
