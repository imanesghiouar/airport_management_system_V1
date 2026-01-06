import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Scan, 
  Layers, 
  Terminal,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/" },
  { id: "detection", label: "Detection Lab", icon: Scan, path: "/detection" },
  { id: "classification", label: "Classification Lab", icon: Layers, path: "/classification" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-sidebar border-r border-border flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="font-mono text-xs text-muted-foreground tracking-widest">
          MISSION CONTROL
        </div>
        <div className="font-mono text-sm text-primary mt-1 tracking-wide">
          AEROINTEL v1.0
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Modules
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 text-sm transition-all",
                "hover:bg-muted/50",
                isActive && "nav-active bg-secondary"
              )}
            >
              <Icon 
                size={16} 
                className={cn(
                  "text-muted-foreground",
                  isActive && "text-primary"
                )} 
              />
              <span className={cn(
                "font-mono text-xs tracking-wide",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              {isActive && (
                <ChevronRight size={12} className="ml-auto text-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="status-led status-led-online" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            System Online
          </span>
        </div>
        <div className="mt-2 font-mono text-[10px] text-muted-foreground/60">
          UPTIME: 99.97%
        </div>
      </div>

      {/* Hidden Admin Access */}
      <Link
        to="/admin"
        className="p-2 border-t border-border hover:bg-muted/30 transition-colors opacity-30 hover:opacity-100"
      >
        <Terminal size={14} className="text-muted-foreground mx-auto" />
      </Link>
    </aside>
  );
}
