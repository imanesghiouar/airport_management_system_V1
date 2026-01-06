import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "online" | "offline" | "warning" | "processing";
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "status-led",
        status === "online" && "status-led-online",
        status === "offline" && "status-led-offline",
        status === "warning" && "status-led-warning",
        status === "processing" && "status-led-online"
      )} />
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
