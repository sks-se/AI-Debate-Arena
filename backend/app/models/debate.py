from pydantic import BaseModel

class DebateRequest(BaseModel):

    character: str

    message: str
