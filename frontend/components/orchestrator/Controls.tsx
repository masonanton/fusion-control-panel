import React, { useState } from "react";
import { abortRun, postProcedure, startRun, Procedure } from "./api";


interface Props {
    proc: Procedure;
    canStart: boolean;
}


export const Controls: React.FC<Props> = ({ proc, canStart }) => {
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);


    async function load() {
        setBusy(true);
        setErr(null);
        try { await postProcedure(proc); } catch (e: any) { setErr(e?.message || String(e)); }
        setBusy(false);
    }
    async function start() {
        setBusy(true);
        setErr(null);
        try { await startRun(); } catch (e: any) { setErr(e?.message || String(e)); }
        setBusy(false);
    }
    async function abort() {
        setBusy(true);
        setErr(null);
        try { await abortRun(); } catch (e: any) { setErr(e?.message || String(e)); }
        setBusy(false);
    }


    return (
        <div className="flex items-center gap-3">
            <button
                onClick={load}
                disabled={busy}
                className={`px-4 py-2 rounded-lg text-white ${busy ? "bg-neutral-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >Load Procedure</button>
            <button
                onClick={start}
                disabled={!canStart || busy}
                className={`px-4 py-2 rounded-lg text-white ${!canStart || busy ? "bg-neutral-400" : "bg-green-600 hover:bg-green-700"}`}
            >Start Run</button>
            <button
                onClick={abort}
                disabled={busy}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
            >Abort</button>
            {err && <span className="text-sm text-red-700">{err}</span>}
        </div>
    );
};