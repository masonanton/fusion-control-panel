import type { Telemetry } from "@/types/telemetry";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";


function StatusDot({ ok }: { ok: boolean }) {
    return <span className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-rose-500"}`} />;
}


export default function InterlocksPanel({ tel }: { tel: Telemetry }) {
    const items = [
        { label: "Vacuum OK", ok: tel.interlocks.vacuumOk },
        { label: "Door Closed", ok: tel.interlocks.doorClosed },
        { label: "E‑Stop OK", ok: tel.interlocks.estopOk },
        { label: "Comms OK", ok: tel.interlocks.commsOk },
    ];


    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="h-5 w-5" /> Interlocks
                </CardTitle>
                <CardDescription>Hardware rules are enforced in hardware; UI is advisory</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                {items.map((it) => (
                    <div key={it.label} className="flex items-center justify-between rounded-lg border p-2">
                        <span className="text-sm">{it.label}</span>
                        <div className="flex items-center gap-2">
                            <StatusDot ok={it.ok} />
                            <Badge variant={it.ok ? "outline" : "destructive"}>{it.ok ? "OK" : "BLOCK"}</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">For HV enable, all interlocks must be satisfied.</CardFooter>
        </Card>
    );
}