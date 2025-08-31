from fastapi import APIRouter, HTTPException

from fastapi import APIRouter, HTTPException
from ..engine.models import Procedure, RunStatus
from ..engine.engine import Engine

router = APIRouter()
_current_proc: Procedure | None = None

def init_routes(engine: Engine) -> APIRouter:
    @router.post("/procedure")
    def set_procedure(proc: Procedure):
        global _current_proc
        _current_proc = proc
        return {"ok": True, "name": proc.name, "steps": len(proc.steps)}

    @router.post("/run/start")
    async def start_run():
        if _current_proc is None:
            raise HTTPException(400, "No procedure loaded")
        if engine.state.running:
            raise HTTPException(409, "Run already in progress")
        await engine.start(_current_proc)
        return {"ok": True}

    @router.post("/run/abort")
    async def abort_run():
        await engine.abort()
        return {"ok": True}

    @router.get("/run/status", response_model=RunStatus)
    def run_status():
        return engine.state

    return router
