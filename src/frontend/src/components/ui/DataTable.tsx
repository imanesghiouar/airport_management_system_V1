import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  highlight?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, string | number>[];
  className?: string;
}

export function DataTable({ columns, data, className }: DataTableProps) {
  return (
    <div className={cn("panel overflow-hidden", className)}>
      {/* Header */}
      <div className="grid border-b border-border bg-muted/30 px-4 py-2" 
           style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
        {columns.map((col) => (
          <div key={col.key} className="telemetry-label">
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {data.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="grid px-4 py-3 hover:bg-muted/20 transition-colors"
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
          >
            {columns.map((col) => (
              <div 
                key={col.key} 
                className={cn(
                  "font-mono text-xs",
                  col.highlight ? "text-primary" : "text-foreground"
                )}
              >
                {row[col.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
