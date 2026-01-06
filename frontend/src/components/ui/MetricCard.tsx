import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function MetricCard({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  trend,
  trendValue,
  className 
}: MetricCardProps) {
  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="telemetry-label">{label}</div>
          <div className="metric-value mt-2">
            {value}
            {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={cn(
              "font-mono text-xs mt-1",
              trend === "up" && "text-telemetry-green",
              trend === "down" && "text-telemetry-red",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && "↑"} {trend === "down" && "↓"} {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <Icon size={20} className="text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
