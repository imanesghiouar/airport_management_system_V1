import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  type: "input" | "output" | "error" | "info";
  content: string;
  timestamp?: string;
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  title?: string;
  className?: string;
}

export function TerminalWindow({ lines, title = "SYSTEM_LOG", className }: TerminalWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className={cn("terminal-window flex flex-col", className)}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
          {title}
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-telemetry-red/60" />
          <div className="w-2 h-2 rounded-full bg-telemetry-amber/60" />
          <div className="w-2 h-2 rounded-full bg-telemetry-green/60" />
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-0.5"
      >
        {lines.map((line, index) => (
          <div key={index} className="terminal-line flex gap-2">
            {line.timestamp && (
              <span className="text-muted-foreground/50 flex-shrink-0">
                [{line.timestamp}]
              </span>
            )}
            {line.type === "input" && (
              <span className="terminal-prompt flex-shrink-0">$</span>
            )}
            <span className={cn(
              line.type === "error" && "text-telemetry-red",
              line.type === "info" && "text-telemetry-cyan",
              line.type === "input" && "text-telemetry-cyan"
            )}>
              {line.content}
            </span>
          </div>
        ))}
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span className="animate-terminal-blink ml-1">_</span>
        </div>
      </div>
    </div>
  );
}
