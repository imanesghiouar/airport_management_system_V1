import { useState, useEffect } from "react";
import { Terminal, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "DEBUG" | "WARN" | "ERROR";
  module: string;
  content: string;
}

const generateLogEntry = (): LogEntry => {
  const modules = ["YOLO", "AERONET", "RESNET", "DQN", "SYSTEM", "API"];
  const levels: LogEntry["level"][] = ["INFO", "DEBUG", "WARN", "ERROR"];
  
  const contents = [
    '{"input_shape": [1, 3, 640, 640], "output_shape": [1, 84, 8400]}',
    'Bellman update: Q(s,a) = r + γ * max(Q(s\',a\'))',
    '{"confidence": 0.8921, "class_id": 47, "variant": "737-800"}',
    'GPU memory: 6.2GB / 8.0GB allocated',
    'Inference complete: 42.3ms latency',
    '{"gate_id": "B4", "flight": "KL1234", "action": "ASSIGN"}',
    'Model checkpoint saved: epoch_100_loss_0.0234.pth',
    'RarePlanes loader: 14764 training samples indexed',
    '{"mAP@0.5": 0.4707, "precision": 0.8077, "recall": 0.1690}',
    'DQN epsilon decay: 0.052 → 0.051',
    'State tensor shape: torch.Size([1, 512])',
    'Action probabilities: [0.12, 0.45, 0.23, 0.08, 0.12]',
  ];

  return {
    timestamp: new Date().toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    module: modules[Math.floor(Math.random() * modules.length)],
    content: contents[Math.floor(Math.random() * contents.length)],
  };
};

export default function AdminConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogEntry["level"] | "ALL">("ALL");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = [
      { timestamp: new Date().toISOString(), level: "INFO", module: "SYSTEM", content: "ADMIN CONSOLE INITIALIZED" },
      { timestamp: new Date().toISOString(), level: "INFO", module: "SYSTEM", content: "AEROINTEL v1.0 BUILD 2024.01.15" },
      { timestamp: new Date().toISOString(), level: "DEBUG", module: "SYSTEM", content: "SESSION_ID: 0x7F3A9C2E" },
    ];
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, generateLogEntry()].slice(-200));
    }, 500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredLogs = filter === "ALL" 
    ? logs 
    : logs.filter((log) => log.level === filter);

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO": return "text-telemetry-cyan";
      case "DEBUG": return "text-muted-foreground";
      case "WARN": return "text-telemetry-amber";
      case "ERROR": return "text-telemetry-red";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            <span className="text-xs">EXIT</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-primary" />
            <span className="text-sm tracking-wider">ADMIN_CONSOLE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-1">
            {(["ALL", "INFO", "DEBUG", "WARN", "ERROR"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-2 py-1 text-[10px] border transition-colors ${
                  filter === level 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          {/* Pause/Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1 text-[10px] border transition-colors ${
              isPaused 
                ? "border-telemetry-amber text-telemetry-amber" 
                : "border-telemetry-green text-telemetry-green"
            }`}
          >
            {isPaused ? "PAUSED" : "STREAMING"}
          </button>
          
          {/* Clear */}
          <button
            onClick={() => setLogs([])}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Log Output */}
      <div className="h-[calc(100vh-52px)] overflow-auto p-4 text-xs">
        {filteredLogs.map((log, index) => (
          <div key={index} className="flex gap-4 py-0.5 hover:bg-muted/20">
            <span className="text-muted-foreground/50 flex-shrink-0 w-52">
              {log.timestamp}
            </span>
            <span className={`flex-shrink-0 w-12 ${getLevelColor(log.level)}`}>
              [{log.level}]
            </span>
            <span className="text-muted-foreground flex-shrink-0 w-20">
              {log.module}
            </span>
            <span className="text-foreground">
              {log.content}
            </span>
          </div>
        ))}
        
        {/* Cursor */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-primary">$</span>
          <span className="animate-terminal-blink">_</span>
        </div>
      </div>
    </div>
  );
}
