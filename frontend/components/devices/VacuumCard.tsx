import type { Telemetry } from "@/types/telemetry";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Link2, Fan, Play, Square } from "lucide-react";


function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
    return (
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-lg font-semibold tabular-nums">
                {value}
                {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
            </span>
        </div>
    );
}
function SubtleHelp({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-2 text-xs text-muted-foreground">{children}</div>;
}


export default function VacuumCard({ tel, setTel }: { tel: Telemetry; setTel: React.Dispatch<React.SetStateAction<Telemetry>> }) {
    const pumpOn = tel.vac.pumpOn;
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Fan className="h-5 w-5" /> Vacuum Pump
                    </CardTitle>
                    <Badge variant={pumpOn ? "default" : "secondary"}>{pumpOn ? "Running" : "Stopped"}</Badge>
                </div>
                <CardDescription>Backing or turbo controller (mocked)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Metric label="Chamber Pressure" value={tel.vac.chamberTorr.toFixed(2)} unit="Torr" />
                    <Metric label="Speed" value={tel.vac.speedPct.toFixed(0)} unit="%" />
                </div>
                <div className="space-y-2">
                    <Label>Set Speed (%)</Label>
                    <div className="flex items-center gap-3">
                        <Slider value={[tel.vac.speedPct]} min={0} max={100} step={1} onValueChange={([v]) => setTel((t) => ({ ...t, vac: { ...t.vac, speedPct: v } }))} />
                        <Input className="w-24" value={tel.vac.speedPct.toFixed(0)} onChange={(e) => {
                            const v = Number(e.target.value || 0);
                            if (!Number.isNaN(v)) setTel((t) => ({ ...t, vac: { ...t.vac, speedPct: Math.max(0, Math.min(100, v)) } }));
                        }} />
                    </div>
                    <SubtleHelp>Wire to backend later: POST /vac/speed, /vac/start</SubtleHelp>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button variant={pumpOn ? "secondary" : "default"} onClick={() => setTel((t) => ({ ...t, vac: { ...t.vac, pumpOn: !t.vac.pumpOn } }))}>
                    {pumpOn ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />} {pumpOn ? "Stop Pump" : "Start Pump"}
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4" /> RS‑232/485/Ethernet
                </div>
            </CardFooter>
        </Card>
    );
}