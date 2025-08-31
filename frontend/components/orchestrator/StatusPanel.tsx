import React from "react";
import type { RunStatus } from "./api";


export const StatusPanel: React.FC<{ status: RunStatus }> = ({ status }) => (
    <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-3 overflow-auto text-xs h-[28rem]">{JSON.stringify(status, null, 2)}</pre>
);