from pathlib import Path

PROMPT_DIR = Path(__file__).parent.parent / "prompts"

PROMPTS = {
    "adi_shankaracharya": "adi_shankaracharya.txt",
    "chanakya": "chanakya.txt",
    "shivaji_maharaj": "shivaji_maharaj.txt",
    "srinivasa_ramanujan": "srinivasa_ramanujan.txt",
    "razia_sultan": "razia_sultan.txt",
    "apj_abdul_kalam": "apj_abdul_kalam.txt",
}

def load_prompt(character: str):
    filename = PROMPTS.get(character.lower())

    if filename is None:
        raise ValueError(f"Unknown character: {character}")

    filepath = PROMPT_DIR / filename

    return filepath.read_text(encoding="utf-8")
