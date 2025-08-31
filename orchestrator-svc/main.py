# orchestrator_service/main.py
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .utils.logging import setup_logging
from .clients.mfc import MfcClient
from .clients.hv import HvClient
from .clients.vac import VacClient
from .api.routes import init_routes
from .engine.engine import Engine

setup_logging()

# Instantiate singletons
mfc_client = MfcClient(settings.MFC_URL)
hv_client  = HvClient(settings.HV_URL)
vac_client = VacClient(settings.VAC_URL)
engine = Engine(mfc_client, hv_client, vac_client)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- startup ----
    await asyncio.gather(
        mfc_client.open(),
        hv_client.open(),
        vac_client.open(),
    )
    try:
        yield
    finally:
        # ---- shutdown ----
        await asyncio.gather(
            mfc_client.close(),
            hv_client.close(),
            vac_client.close(),
        )

app = FastAPI(title="Orchestrator Service", lifespan=lifespan)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount API routes
app.include_router(init_routes(engine))
