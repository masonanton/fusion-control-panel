import httpx

class RestClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self._client: httpx.AsyncClient | None = None

    async def open(self):
        if not self._client:
            self._client = httpx.AsyncClient(base_url=self.base_url, timeout=10.0)

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None

    @property
    def client(self) -> httpx.AsyncClient:
        assert self._client, "Client not opened. Call open() on startup."
        return self._client
