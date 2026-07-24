import os

from dotenv import load_dotenv
from openai import OpenAI
from app.utils.prompt_loader import load_prompt

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)


def ask_ai(character: str, message: str = "", mode: str = "debate"):

    system_prompt = load_prompt(character)

    if mode == "intro":

        user_prompt = """
You are starting a debate with the player.

Generate ONLY the opening message.

Rules:

1. Keep the response between 35 and 55 words.
2. Introduce yourself in ONE short sentence.
3. Explain your thinking style in ONE short sentence.
4. Generate ONE unique debate topic that naturally matches your own philosophy, expertise and personality.
5. Never repeat common topics like remote work or social media unless they genuinely fit your character.
6. Every character should ask different kinds of questions.
7. Ask EXACTLY ONE debate question.
8. Do NOT start debating yet.
9. Do NOT give arguments.
10. Stay completely in character.
11. Never mention that you are an AI.
12. Use simple English suitable for college students.

Examples of suitable topics:

Chanakya:
Leadership, Politics, Business, Power, Strategy, Corruption, Economy, National Security

Adi Shankaracharya:
Spirituality, Happiness, Attachment, Desire, Purpose of Life, Ethics, Inner Peace

Socrates:
Truth, Knowledge, Justice, Education, Morality, Critical Thinking

Sun Tzu:
War, Competition, Leadership, Strategy, Decision Making

Nikola Tesla:
Technology, AI, Innovation, Electricity, Future of Humanity

Albert Einstein:
Science, Curiosity, Creativity, Education, Humanity

The opening should feel like a natural conversation, not a speech.
"""

        max_tokens = 180

    else:

        user_prompt = f"""
The player replied:

{message}

Continue the debate.

Rules:

1. Keep your reply between 40 and 70 words.
2. Challenge only ONE point from the player's argument.
3. Do not repeat your previous arguments.
4. Stay completely in character.
5. End with ONE short follow-up question.
6. Do not write essays.
7. Use simple English.
"""

        max_tokens = 180

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

        max_tokens=max_tokens,
        temperature=0.8
    )

    return response.choices[0].message.content
