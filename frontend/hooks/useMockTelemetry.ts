import { useEffect, useState } from "react";
import type { Telemetry } from "@/types/telemetry";

export function useMockTelemetry() {
    const [tel, setTel] = useState<Telemetry>({
        // populated state with fake data for now
        mfc: { flow: 0.2, setpoint: 0.5, pressure: 760, tempC: 22.1, valveOpen: false },
        hv: { kv: 0, ma: 0, enabled: false, fault: false, rampTarget: 15 },
        vac: { chamberTorr: 500, pumpOn: false, speedPct: 0 },
        interlocks: { vacuumOk: false, doorClosed: true, estopOk: true, commsOk: true },
    })

    useEffect(() => {
        const id = setInterval(() => {
            setTel(t => {
                const targetP = t.vac.pumpOn ? 5 : 500;
                const pressure = t.vac.chamberTorr + (targetP - t.vac.chamberTorr) * 0.03;
                const flow = t.mfc.valveOpen ? t.mfc.setpoint + (Math.random() - 0.5) * 0.05 : 0;
                const kv = t.hv.enabled ? t.hv.kv + (t.hv.rampTarget - t.hv.kv) * 0.08 : Math.max(0, t.hv.kv - 0.8);
                const ma = t.hv.enabled ? Math.max(0, 0.05 * kv - 0.2 + (Math.random() - 0.5) * 0.02) : 0;

                return {
                    ...t,
                    mfc: { ...t.mfc, flow: Math.max(0, flow), pressure, tempC: 22.0 + Math.sin(Date.now() / 4e4) },
                    hv:  { ...t.hv, kv: Math.max(0, kv), ma },
                    vac: { ...t.vac, chamberTorr: pressure },
                    interlocks: { ...t.interlocks, vacuumOk: pressure < 100, commsOk: true },
                };
            })
        }, 350);
        return () => clearInterval(id);
    }, []);

    return [tel, setTel] as const;
}