import type { Telemetry } from "@/types/telemetry";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Zap, Power } from "lucide-react";
import { Switch } from "@/components/ui/switch";


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


export default function HVCard({ tel, setTel }: { tel: Telemetry; setTel: React.Dispatch<React.SetStateAction<Telemetry>> }) {
    const target = tel.hv.rampTarget;
    const armed = tel.hv.enabled;
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Zap className="h-5 w-5" /> High Voltage Supply
                    </CardTitle>
                    <Badge variant={tel.hv.fault ? "destructive" : armed ? "default" : "secondary"}>
                        {tel.hv.fault ? "Fault" : armed ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
                <CardDescription>Analog or Serial‑controlled (mocked)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Metric label="Voltage" value={tel.hv.kv.toFixed(2)} unit="kV" />
                    <Metric label="Current" value={tel.hv.ma.toFixed(3)} unit="mA" />
                    <div className="col-span-2">
                        <Label className="mb-2 block">Ramp Target (kV)</Label>
                        <div className="flex items-center gap-3">
                            <Slider value={[target]} min={0} max={40} step={0.1} onValueChange={([v]) => setTel((t) => ({ ...t, hv: { ...t.hv, rampTarget: v } }))} />
                            <Input className="w-24" value={target.toFixed(1)} onChange={(e) => {
                                const v = Number(e.target.value || 0);
                                if (!Number.isNaN(v)) setTel((t) => ({ ...t, hv: { ...t.hv, rampTarget: Math.max(0, Math.min(40, v)) } }));
                            }} />
                        </div>
                        <SubtleHelp>Wire to backend later: POST /hv/target, /hv/enable</SubtleHelp>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Switch
                        checked={armed}
                        onCheckedChange={(v) => setTel((t) => ({ ...t, hv: { ...t.hv, enabled: v } }))}
                    />
                    <span className="text-sm">HV Enable</span>
                    <Button
                        variant="destructive"
                        className="ml-4"
                        onClick={() =>
                            setTel((t) => ({ ...t, hv: { ...t.hv, enabled: false } }))
                        }
                    >
                        <Power className="mr-2 h-4 w-4" /> HV OFF
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" /> Interlocks respected in backend
                </div>
            </CardFooter>
        </Card>
    );
}