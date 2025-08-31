"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MFCCard from "@/components/devices/MFCCard";
import HVCard from "@/components/devices/HVCard";
import VacuumCard from "@/components/devices/VacuumCard";
import InterlocksPanel from "@/components/system/InterlocksPanel";
import EventLog from "@/components/log/EventLog";
import ReactorSchedulerPanel from "@/components/orchestrator/ReactorSchedulerPanel";
import { useMockTelemetry } from "@/hooks/useMockTelemetry";

export default function Page() {
  const [tel, setTel] = useMockTelemetry();

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      {/* banner component could be extracted too */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mfc">MFC</TabsTrigger>
          <TabsTrigger value="hv">High Voltage</TabsTrigger>
          <TabsTrigger value="vac">Vacuum</TabsTrigger>
          <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MFCCard tel={tel} setTel={setTel} />
          <HVCard tel={tel} setTel={setTel} />
          <VacuumCard tel={tel} setTel={setTel} />
          <InterlocksPanel tel={tel} />
          <EventLog />
        </TabsContent>

        <TabsContent value="mfc" className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MFCCard tel={tel} setTel={setTel} />
          <EventLog />
        </TabsContent>

        <TabsContent value="hv" className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <HVCard tel={tel} setTel={setTel} />
          <InterlocksPanel tel={tel} />
          <EventLog />
        </TabsContent>

        <TabsContent value="vac" className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <VacuumCard tel={tel} setTel={setTel} />
          <EventLog />
        </TabsContent>

        <TabsContent value="orchestrator" className="pt-4">
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <ReactorSchedulerPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
