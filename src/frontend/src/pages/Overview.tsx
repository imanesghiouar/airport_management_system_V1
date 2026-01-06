import { MetricCard } from "@/components/ui/MetricCard";
import { TelemetryPanel } from "@/components/ui/TelemetryPanel";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Activity, Cpu, Database, Radar, Plane, LayoutDashboard } from "lucide-react";

const systemLogs = [
  { type: "info" as const, content: "SYSTEM_BOOT: Initializing AeroIntel v1.0...", timestamp: "00:00:01" },
  { type: "output" as const, content: "Loading YOLOv8-nano weights: rareplanes_best.pt", timestamp: "00:00:03" },
  { type: "output" as const, content: "Loading classifier: fgvc_aircraft.pth", timestamp: "00:00:05" },
  { type: "output" as const, content: "All subsystems nominal. Ready for inference.", timestamp: "00:00:07" },
];

const modelMetrics = [
  { label: "YOLOv8 mAP@0.5", value: "0.4707", highlight: true },
  { label: "Classifier Accuracy", value: "50.0%", highlight: true },
  { label: "Avg Inference", value: "42ms" },
];

const systemMetrics = [
  { label: "GPU Utilization", value: "78%" },
  { label: "VRAM Usage", value: "6.2 GB" },
  { label: "Inference Queue", value: "0" },
  { label: "Uptime", value: "99.97%" },
];

export default function Overview() {
  return (
    <div className="min-h-screen p-6 flex">
      {/* Main Content Area */}
      <div className="flex-1 mr-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-xl text-foreground tracking-wide flex items-center gap-3">
              <LayoutDashboard size={20} className="text-primary" />
              MISSION OVERVIEW
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              GLOBAL SYSTEM PERFORMANCE METRICS
            </p>
          </div>
          <StatusBadge status="online" label="All Systems Operational" />
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Detection Rate"
            value="94.2"
            unit="%"
            icon={Radar}
            trend="up"
            trendValue="+2.1% from baseline"
          />
          <MetricCard
            label="Classification Conf."
            value="0.847"
            icon={Plane}
            trend="neutral"
            trendValue="Stable"
          />
          <MetricCard
            label="Inference Time"
            value="42"
            unit="ms"
            icon={Cpu}
            trend="down"
            trendValue="-8ms improved"
          />
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Models Loaded"
            value="2"
            icon={Database}
          />
          <MetricCard
            label="Total Inferences"
            value="12,847"
            icon={Activity}
          />
          <MetricCard
            label="Active Sessions"
            value="1"
            icon={Cpu}
          />
        </div>

        {/* Module Status */}
        <div className="panel p-4 mb-6">
          <div className="section-header border-b border-border pb-2 mb-4">MODULE_STATUS</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border border-border">
              <span className="telemetry-label">Detection Lab</span>
              <StatusBadge status="online" label="Ready" />
            </div>
            <div className="flex items-center justify-between p-3 border border-border">
              <span className="telemetry-label">Classification Lab</span>
              <StatusBadge status="online" label="Ready" />
            </div>
            <div className="flex items-center justify-between p-3 border border-border">
              <span className="telemetry-label">Admin Console</span>
              <StatusBadge status="online" label="Secure" />
            </div>
          </div>
        </div>

        {/* System Log */}
        <TerminalWindow
          title="BOOT_SEQUENCE_LOG"
          lines={systemLogs}
          className="h-48"
        />

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-muted-foreground/60">
          <span className="font-mono text-[10px]">
            AEROINTEL MISSION CONTROL • BUILD 2024.01.15
          </span>
          <span className="font-mono text-[10px]">
            SESSION ID: 0x7F3A9C2E
          </span>
        </div>
      </div>

      {/* Right Sidebar - Telemetry */}
      <div className="w-72 space-y-4">
        <TelemetryPanel
          title="MODEL_PERFORMANCE"
          items={modelMetrics}
        />
        <TelemetryPanel
          title="SYSTEM_RESOURCES"
          items={systemMetrics}
        />
      </div>
    </div>
  );
}
