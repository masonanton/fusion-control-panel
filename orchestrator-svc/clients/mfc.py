from .base import RestClient

class MfcClient(RestClient):
    async def set_flow(self, sccm: float):
        await self.client.post("/setpoint", json={"sccm": float(sccm)})

    async def set_valve(self, open_: bool):
        await self.client.post("/valve", json={"open": bool(open_)})

    async def status(self) -> dict:
        r = await self.client.get("/status")
        r.raise_for_status()
        return r.json()
