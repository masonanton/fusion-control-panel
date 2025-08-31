export const ORCH_URL =
    (typeof window !== "undefined"
        ? (process.env.NEXT_PUBLIC_ORCH_URL || (window as any).ORCH_URL)
        : process.env.NEXT_PUBLIC_ORCH_URL) || "http://localhost:8000";


export interface Procedure {
    name: string;
    steps: any[]; // intentionally loose — server validates
}


export interface RunStatus {
    running?: boolean;
    // allow unknown fields; we'll render JSON verbatim
    [k: string]: any;
}


async function api<T = any>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${ORCH_URL}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return (await res.json()) as T;
    // @ts-ignore
    return undefined as T;
}


export async function postProcedure(proc: Procedure) {
    return api(`/procedure`, { method: "POST", body: JSON.stringify(proc) });
}
export async function startRun() {
    return api(`/run/start`, { method: "POST" });
}
export async function abortRun() {
    return api(`/run/abort`, { method: "POST" });
}
export async function getRunStatus(): Promise<RunStatus> {
    return api(`/run/status`);
}