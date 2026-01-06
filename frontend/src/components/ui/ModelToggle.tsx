import { cn } from "@/lib/utils";

interface ModelOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface ModelToggleProps {
  options: ModelOption[];
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function ModelToggle({ options, selected, onSelect, className }: ModelToggleProps) {
  return (
    <div className={cn("flex border border-border", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "flex-1 px-4 py-3 transition-colors",
            "font-mono text-xs tracking-wide text-center",
            selected === option.id 
              ? "bg-primary text-primary-foreground" 
              : "bg-card text-muted-foreground hover:bg-muted/50"
          )}
        >
          <div>{option.label}</div>
          {option.sublabel && (
            <div className={cn(
              "text-[10px] mt-0.5",
              selected === option.id 
                ? "text-primary-foreground/80" 
                : "text-muted-foreground/60"
            )}>
              {option.sublabel}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
