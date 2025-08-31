from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class Step(BaseModel):
    op: str
    params: Dict[str, Any] = {}

class Procedure(BaseModel):
    name: str
    steps: List[Step]

class RunStatus(BaseModel):
    running: bool = False
    current_step: int = 0
    current_op: Optional[str] = None
    started_at: Optional[float] = None
    last_event: Optional[str] = None
    error: Optional[str] = None

    