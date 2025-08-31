import asyncio, time, logging
from typing import Optional, Dict, Any
from .models import Procedure, RunStatus
from ..clients.mfc import MfcClient
from ..clients.hv import HvClient
from ..clients.vac import VacClient

log = logging.getLogger("engine")

class Engine:
    def __init__(self, mfc: MfcClient, hv: HvClient, vac: VacClient):
        self.mfc, self.hv, self.vac = mfc, hv, vac
        self.state = RunStatus()
        self._task: Optional[asyncio.Task] = None

    async def start(self, proc: Procedure):
        if self.state.running:
            raise RuntimeError("Run already in progress")
        self._task = asyncio.create_task(self._run(proc))

    async def abort(self):
        log.warning("Abort requested")
        try: await self.hv.set_target(0.0)
        except: pass
        try: await self.hv.enable(False)
        except: pass
        try: await self.mfc.set_flow(0.0)
        except: pass
        try: await self.mfc.set_valve(False)
        except: pass
        # keep pump running
        if self._task:
            self._task.cancel()
        self.state.running = False
        self.state.current_op = None
        self.state.last_event = "Aborted by user"

    async def _run(self, proc: Procedure):
        self.state = RunStatus(running=True, started_at=time.time())
        try:
            for i, step in enumerate(proc.steps, start=1):
                self.state.current_step = i
                self.state.current_op = step.op
                self.state.last_event = f"Executing {step.op} {step.params}"
                await self._execute(step.op, step.params)
            self.state.last_event = "Procedure complete"
        except asyncio.CancelledError:
            log.info("Run task cancelled")
        except Exception as e:
            self.state.error = str(e)
            log.exception("Run failed: %s", e)
            await self.abort()
        finally:
            self.state.running = False
            self.state.current_op = None

    # ---- step handlers ----
    async def _execute(self, op: str, p: Dict[str, Any]):
        if   op == "assert_interlocks":
            # TODO: call your interlocks source; for now we trust UI/hardware
            return
        elif op == "vac_start":              await self.vac.start(p.get("speedPct", 100))
        elif op == "vac_stop":               await self.vac.stop()
        elif op == "wait_seconds":           await asyncio.sleep(float(p["seconds"]))
        elif op == "wait_pressure_below":    await self._wait_pressure_below(p["torr"], p.get("stableSeconds", 0), p.get("timeoutSeconds", 120))
        elif op == "wait_pressure_between":  await self._wait_pressure_between(p["lowTorr"], p["highTorr"], p.get("stableSeconds", 0), p.get("timeoutSeconds", 120))
        elif op == "mfc_set_flow":           await self.mfc.set_flow(p["sccm"])
        elif op == "mfc_valve":              await self.mfc.set_valve(p["open"])
        elif op == "hv_enable":              await self.hv.enable(p["on"])
        elif op == "hv_set_target":          await self.hv.set_target(p["kv"])
        elif op == "wait_hv_reached":        await self._wait_hv_reached(p["kv"], p.get("toleranceKv", 0.5), p.get("timeoutSeconds", 120))
        elif op == "abort_if":               await self._abort_if(p.get("currentMaGt"), p.get("pressureTorrGt"))
        elif op == "hold":                   await self._hold_with_limits(p["seconds"], p.get("abortOn", {}))
        else:
            raise ValueError(f"Unknown op {op}")

    # ---- helpers ----
    async def _read_pressure(self) -> float:
        vac = await self.vac.status()
        p = vac.get("chamber_torr")
        if p is None:
            m = await self.mfc.status()
            p = m.get("pressure_torr")
        if p is None:
            raise RuntimeError("No pressure reading available")
        return float(p)

    async def _wait_pressure_below(self, target: float, stable: float, timeout: float):
        start, stable_since = time.time(), None
        while True:
            p = await self._read_pressure()
            if p < target:
                stable_since = stable_since or time.time()
                if time.time() - stable_since >= stable: return
            else:
                stable_since = None
            if time.time() - start > timeout:
                raise TimeoutError(f"Timeout waiting pressure<{target} Torr (last {p:.4f})")
            await asyncio.sleep(0.5)

    async def _wait_pressure_between(self, lo: float, hi: float, stable: float, timeout: float):
        start, stable_since = time.time(), None
        while True:
            p = await self._read_pressure()
            if lo <= p <= hi:
                stable_since = stable_since or time.time()
                if time.time() - stable_since >= stable: return
            else:
                stable_since = None
            if time.time() - start > timeout:
                raise TimeoutError(f"Timeout waiting {lo}-{hi} Torr (last {p:.4f})")
            await asyncio.sleep(0.5)

    async def _wait_hv_reached(self, kv: float, tol: float, timeout: float):
        start = time.time()
        while True:
            s = await self.hv.status()
            v = float(s.get("kv", 0.0))
            if abs(v - kv) <= tol: return
            if time.time() - start > timeout:
                raise TimeoutError(f"Timeout waiting HV {kv}±{tol} kV (last {v:.2f})")
            await asyncio.sleep(0.5)

    async def _abort_if(self, currentMaGt: float | None, pressureTorrGt: float | None):
        hv, p = await self.hv.status(), await self._read_pressure()
        if currentMaGt is not None and float(hv.get("ma", 0.0)) > currentMaGt:
            raise RuntimeError(f"Abort: HV current {hv.get('ma'):.3f} mA > {currentMaGt}")
        if pressureTorrGt is not None and p > pressureTorrGt:
            raise RuntimeError(f"Abort: Pressure {p:.4f} Torr > {pressureTorrGt}")

    async def _hold_with_limits(self, seconds: float, abortOn: dict):
        end = time.time() + float(seconds)
        while time.time() < end:
            await self._abort_if(abortOn.get("currentMaGt"), abortOn.get("pressureTorrGt"))
            await asyncio.sleep(0.5)
