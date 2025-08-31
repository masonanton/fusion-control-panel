import type { Telemetry } from "@/types/telemetry";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Wifi, Wind, Play, Square } from "lucide-react";

function StatusDot({ ok }: { ok: boolean }) {
    return <span className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-rose-500"}`} />;
}

function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
    return (
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-lg font-semibold tabular-nums">
                {value}
                {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
            </span>
        </div>
    )
}

function SubtleHelp({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-2 text-xs text-muted-foreground">{children}</div>;
}

export default function MFCCard({ tel, setTel }: { tel: Telemetry; setTel: React.Dispatch<React.SetStateAction<Telemetry>> }) {
    const sp = tel.mfc.setpoint;
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Wind className="h-5 w-5" /> Mass Flow Controller
                    </CardTitle>
                    <Badge variant={tel.mfc.valveOpen ? "default" : "secondary"}>{tel.mfc.valveOpen ? "Valve Open" : "Valve Closed"}</Badge>
                </div>
                <CardDescription>MCV‑10 sccm (mocked)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Metric label="Flow" value={tel.mfc.flow.toFixed(3)} unit="sccm" />
                    <Metric label="Pressure" value={tel.mfc.pressure.toFixed(1)} unit="Torr" />
                    <Metric label="Temperature" value={tel.mfc.tempC.toFixed(1)} unit="°C" />
                    <Metric label="Setpoint" value={sp.toFixed(2)} unit="sccm" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mfc-sp">Setpoint (sccm)</Label>
                    <div className="flex items-center gap-3">
                        <Slider id="mfc-sp" value={[sp]} step={0.05} min={0} max={10} onValueChange={([v]) => setTel((t) => ({ ...t, mfc: { ...t.mfc, setpoint: v } }))} />
                        <Input className="w-24" value={sp.toFixed(2)} onChange={(e) => {
                            const v = Number(e.target.value || 0);
                            if (!Number.isNaN(v)) setTel((t) => ({ ...t, mfc: { ...t.mfc, setpoint: Math.max(0, Math.min(10, v)) } }));
                        }} />
                    </div>
                    <SubtleHelp>Wire to your backend later: POST /setpoint, /valve</SubtleHelp>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button variant="secondary" onClick={() => setTel((t) => ({ ...t, mfc: { ...t.mfc, valveOpen: !t.mfc.valveOpen } }))}>
                    {tel.mfc.valveOpen ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />} {tel.mfc.valveOpen ? "Close Valve" : "Open Valve"}
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wifi className="h-4 w-4" /> <StatusDot ok={true} /> serial
                </div>
            </CardFooter>
        </Card>
    );
}