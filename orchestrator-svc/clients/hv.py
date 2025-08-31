from .base import RestClient

class HvClient(RestClient):
    async def enable(self, on: bool):
        await self.client.post("/enable", json={"on": bool(on)})

    async def set_target(self, kv: float):
        await self.client.post("/target", json={"kv": float(kv)})

    async def status(self) -> dict:
        r = await self.client.get("/status")
        r.raise_for_status()
        return r.json()
