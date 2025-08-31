from .base import RestClient

class VacClient(RestClient):
    async def start(self, speed_pct: int = 100):
        await self.client.post("/start", json={"speed_pct": int(speed_pct)})

    async def stop(self):
        await self.client.post("/stop")

    async def status(self) -> dict:
        r = await self.client.get("/status")
        r.raise_for_status()
        return r.json()
