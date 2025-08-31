import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";


export default function EventLog() {
    const [events, setEvents] = useState<string[]>(["Boot: UI loaded", "Telemetry stream: mocked"]);


    useEffect(() => {
        const id = setInterval(() => {
            setEvents((e) => [
                `tick ${new Date().toLocaleTimeString()}`,
                ...e.slice(0, 50),
            ]);
        }, 5000);
        return () => clearInterval(id);
    }, []);


    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5" /> Event Log
                </CardTitle>
                <CardDescription>Recent commands & system notices. Simulated for now</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-h-56 overflow-auto rounded-md border">
                    <ul className="divide-y">
                        {events.map((e, i) => (
                            <li key={i} className="px-3 py-2 text-sm tabular-nums">{e}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end">
                <Button variant="ghost" size="sm" onClick={() => setEvents([])}>Clear</Button>
            </CardFooter>
        </Card>
    );
}