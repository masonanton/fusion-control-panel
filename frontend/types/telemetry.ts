export type Telemetry = {
    mfc: { flow: number; setpoint: number; pressure: number; tempC: number; valveOpen: boolean };
    hv: { kv: number; ma: number; enabled: boolean; fault: boolean; rampTarget: number };
    vac: { chamberTorr: number; pumpOn: boolean; speedPct: number };
    interlocks: { vacuumOk: boolean; doorClosed: boolean; estopOk: boolean; commsOk: boolean };
};