import React, { useState } from "react";
import { ORCH_URL, Procedure } from "./api";
import { useRunStatus } from "./useRunStatus";
import { ProcedureEditor } from "./ProcedureEditor";
import { Controls } from "./Controls";
import { StatusPanel } from "./StatusPanel";
import { QuickBuilder } from "./QuickBuilder";


const Section: React.FC<{ title: string; right?: React.ReactNode; children?: React.ReactNode }>
    = ({ title, right, children }) => (
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                {right}
            </div>
            {children}
        </section>
    );


const exampleProcedure: Procedure = {
    name: "Test Plasma Warmup",
    steps: [
        { action: "vac.pump_down", target: 25, units: "mTorr" },
        { action: "mfc.set_flow", gas: "D2", sccm: 5 },
        { action: "hv.ramp", volts: 15000, rate: 500 },
        { action: "wait", seconds: 30 },
        { action: "hv.hold", seconds: 60 },
        { action: "hv.off" },
        { action: "mfc.set_flow", gas: "D2", sccm: 0 },
    ],
};


export default function ReactorSchedulerPanel() {
    const [proc, setProc] = useState<Procedure>(exampleProcedure);
    const { status, running } = useRunStatus(1000);
    const canStart = Boolean(proc?.name) && Array.isArray(proc?.steps) && !running;


    return (
        <div className="min-h-[70vh] bg-neutral-50 text-neutral-900">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Reactor Scheduler</h1>
                    <p className="text-sm text-neutral-600">Orchestrator: <span className="font-mono">{ORCH_URL}</span></p>
                </div>
                <span className={`px-2 py-0.5 rounded text-sm ${running ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-700'}`}>{running ? 'running' : 'idle'}</span>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Procedure">
                    <ProcedureEditor value={proc} onChange={setProc} />
                    <div className="mt-3">
                        <Controls proc={proc} canStart={canStart} />
                    </div>
                </Section>


                <Section title="Live Status">
                    <StatusPanel status={status} />
                </Section>
            </div>


            <div className="mt-6">
                <Section title="Quick Builder (optional)">
                    <p className="text-sm text-neutral-600 mb-3">Append common steps if your engine supports these actions.</p>
                    <QuickBuilder value={proc} onChange={setProc} />
                </Section>
            </div>
        </div>
    );
}