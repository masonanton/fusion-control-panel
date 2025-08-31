import React, { useState } from "react";
import type { Procedure } from "./api";


export const QuickBuilder: React.FC<{ value: Procedure; onChange: (p: Procedure) => void }> = ({ value, onChange }) => {
    const [action, setAction] = useState("wait");
    const [params, setParams] = useState<Record<string, any>>({ seconds: 5 });


    function addStep() {
        const next: Procedure = { ...value, steps: [...(value.steps || []), { action, ...params }] };
        onChange(next);
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
                <label className="text-sm text-neutral-600">Action</label>
                <select
                    value={action}
                    onChange={(e) => {
                        const a = e.target.value; setAction(a);
                        if (a === "wait") setParams({ seconds: 5 });
                        if (a === "mfc.set_flow") setParams({ gas: "D2", sccm: 5 });
                        if (a === "hv.ramp") setParams({ volts: 10000, rate: 500 });
                        if (a === "hv.hold") setParams({ seconds: 30 });
                        if (a === "vac.pump_down") setParams({ target: 25, units: "mTorr" });
                    }}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                >
                    <option>wait</option>
                    <option>mfc.set_flow</option>
                    <option>hv.ramp</option>
                    <option>hv.hold</option>
                    <option>hv.off</option>
                    <option>vac.pump_down</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="text-sm text-neutral-600">Parameters (JSON)</label>
                <textarea
                    className="w-full h-24 font-mono text-sm rounded-lg border border-neutral-300 p-2"
                    spellCheck={false}
                    value={JSON.stringify(params, null, 2)}
                    onChange={(e) => { try { setParams(JSON.parse(e.target.value)); } catch { } }}
                />
            </div>
            <div className="md:col-span-3">
                <button onClick={addStep} className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black">Add Step</button>
            </div>
        </div>
    );
};