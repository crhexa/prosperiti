from pydantic import BaseModel, Field
from typing import Optional

class Message(BaseModel):
    role        : str           = Field(description="Expected roles: \"user\", \"system\", and \"assistant\"")
    content     : str           = Field()

class GenerationRequest(BaseModel):
    messages    : list[Message]         = []
    filters     : Optional[list[str]]   = []
