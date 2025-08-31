import React, { useEffect, useState } from "react";
import type { Procedure } from "./api";


interface Props {
    value: Procedure;
    onChange: (p: Procedure) => void;
}


export const ProcedureEditor: React.FC<Props> = ({ value, onChange }) => {
    const [text, setText] = useState<string>(JSON.stringify(value, null, 2));
    const [valid, setValid] = useState(true);


    useEffect(() => setText(JSON.stringify(value, null, 2)), [value]);


    function updateName(name: string) {
        const next = { ...value, name };
        onChange(next);
    }


    function onTextChange(t: string) {
        setText(t);
        try {
            const obj = JSON.parse(t);
            const ok = obj && typeof obj.name === "string" && Array.isArray(obj.steps);
            setValid(ok);
            if (ok) onChange(obj);
        } catch {
            setValid(false);
        }
    }


    return (
        <div className="space-y-2">
            <label className="text-sm text-neutral-600">Name</label>
            <input
                value={value.name}
                onChange={(e) => updateName(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-medium"
                placeholder="Warmup / Plasma / Cooldown"
            />
            <textarea
                className="w-full h-96 font-mono text-sm rounded-lg border border-neutral-300 p-3"
                spellCheck={false}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
            />
            <div className="text-xs">Schema: <code>{`{ name: string, steps: any[] }`}</code> — server validates details.</div>
            <div className={`inline-block rounded-full px-2 py-0.5 text-xs ${valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {valid ? "valid" : "invalid"}
            </div>
        </div>
    );
};