import { useEffect, useRef, useState } from "react";
import { getRunStatus, RunStatus } from "./api";


export function useInterval(cb: () => void, ms: number) {
    const ref = useRef(cb);
    useEffect(() => void (ref.current = cb), [cb]);
    useEffect(() => {
        const id = setInterval(() => ref.current(), ms);
        return () => clearInterval(id);
    }, [ms]);
}


export function useRunStatus(pollMs = 1000) {
    const [status, setStatus] = useState<RunStatus>({});
    const [running, setRunning] = useState<boolean>(false);


    async function tick() {
        try {
            const s = await getRunStatus();
            setStatus(s);
            setRunning(Boolean(s?.running));
        } catch {
            // ignore transient errors
        }
    }


    useEffect(() => {
        tick();
    }, []);
    useInterval(tick, pollMs);


    return { status, running } as const;
}