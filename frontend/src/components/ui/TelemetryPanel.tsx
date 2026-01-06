import { cn } from "@/lib/utils";

interface TelemetryItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface TelemetryPanelProps {
  title: string;
  items: TelemetryItem[];
  className?: string;
}

export function TelemetryPanel({ title, items, className }: TelemetryPanelProps) {
  return (
    <div className={cn("panel p-4", className)}>
      <div className="section-header border-b border-border pb-2 mb-4">{title}</div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="telemetry-label">{item.label}</span>
            <span className={cn(
              item.highlight ? "telemetry-highlight" : "telemetry-value"
            )}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
