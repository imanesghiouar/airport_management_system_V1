import { useState } from "react";
import { TelemetryPanel } from "@/components/ui/TelemetryPanel";
import { UploadZone } from "@/components/ui/UploadZone";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Scan, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Detection {
  id: number;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const modelTelemetry = [
  { label: "Model", value: "YOLOv8-nano", highlight: true },
  { label: "Input Size", value: "640×640" },
  { label: "Original", value: "512×512" },
  { label: "Precision", value: "0.8077", highlight: true },
  { label: "Recall", value: "0.1690" },
  { label: "mAP@0.5", value: "0.4707", highlight: true },
  { label: "mAP@0.5:0.95", value: "0.2247" },
];

const datasetInfo = [
  { label: "Dataset", value: "RarePlanes" },
  { label: "Train Images", value: "14,764" },
  { label: "Val Images", value: "2,048" },
  { label: "Classes", value: "1 (aircraft)" },
  { label: "Epochs", value: "100" },
];

// Simulated detections for demo
const mockDetections: Detection[] = [
  { id: 1, label: "aircraft", confidence: 0.92, x: 15, y: 20, width: 12, height: 8 },
  { id: 2, label: "aircraft", confidence: 0.87, x: 45, y: 35, width: 10, height: 6 },
  { id: 3, label: "aircraft", confidence: 0.78, x: 70, y: 55, width: 14, height: 9 },
  { id: 4, label: "aircraft", confidence: 0.71, x: 30, y: 70, width: 11, height: 7 },
];

export default function DetectionLab() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);

  const handleFileSelect = async (file: File) => {
  setUploadedImage(URL.createObjectURL(file));
  setIsProcessing(true);
  
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:5000/detect', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setDetections(data.detections);
  } catch (error) {
    console.error("Detection Error:", error);
  } finally {
    setIsProcessing(false);
  }
};

  const handleReset = () => {
    setUploadedImage(null);
    setDetections([]);
    setInferenceTime(null);
  };

  return (
    <div className="min-h-screen p-6 flex">
      {/* Main Content Area */}
      <div className="flex-1 mr-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-xl text-foreground tracking-wide flex items-center gap-3">
              <Scan size={20} className="text-primary" />
              DETECTION LAB
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              YOLOV8-NANO • RAREPLANES DATASET
            </p>
          </div>
          <StatusBadge 
            status={isProcessing ? "processing" : "online"} 
            label={isProcessing ? "Processing..." : "Ready"} 
          />
        </div>

        {/* Detection Canvas */}
        <div className="panel relative h-[600px] overflow-hidden">
          {!uploadedImage ? (
            <UploadZone
              label="INPUT_SRC_SATELLITE_TILES"
              accept="image/*"
              onFileSelect={handleFileSelect}
              className="absolute inset-0 h-full"
            />
          ) : (
            <div className="relative h-full">
              {/* Image with Grid Overlay */}
              <div className="absolute inset-0 detection-canvas">
                <img
                  src={uploadedImage}
                  alt="Satellite input"
                  className="w-full h-full object-contain"
                />
                
                {/* Detection Boxes */}
                {detections.map((det) => (
                  <div
                    key={det.id}
                    className="detection-box absolute"
                    style={{
                      left: `${det.x}%`,
                      top: `${det.y}%`,
                      width: `${det.width}%`,
                      height: `${det.height}%`,
                    }}
                  >
                    <span className="absolute -top-5 left-0 font-mono text-[10px] text-telemetry-cyan bg-background/80 px-1">
                      {det.label} {(det.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}

                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <span className="font-mono text-xs text-muted-foreground">
                        RUNNING INFERENCE...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button className="btn-industrial flex items-center gap-2">
                  <ZoomIn size={14} />
                </button>
                <button className="btn-industrial flex items-center gap-2">
                  <ZoomOut size={14} />
                </button>
                <button 
                  className="btn-industrial flex items-center gap-2"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} />
                  RESET
                </button>
              </div>

              {/* Inference Stats Overlay */}
              {inferenceTime && (
                <div className="absolute bottom-4 right-4 bg-card/90 border border-border px-3 py-2">
                  <div className="font-mono text-[10px] text-muted-foreground">INFERENCE TIME</div>
                  <div className="font-mono text-sm text-primary">{inferenceTime.toFixed(1)}ms</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detection Results */}
        {detections.length > 0 && (
          <div className="mt-4 panel p-4">
            <div className="section-header">DETECTION_RESULTS</div>
            <div className="grid grid-cols-4 gap-4 mt-3">
              {detections.map((det) => (
                <div key={det.id} className="bg-muted/30 border border-border p-3">
                  <div className="font-mono text-xs text-primary">
                    OBJECT_{det.id.toString().padStart(3, '0')}
                  </div>
                  <div className="font-mono text-sm text-foreground mt-1">
                    {det.label.toUpperCase()}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">
                    Conf: {(det.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Telemetry */}
      <div className="w-72 space-y-4">
        <TelemetryPanel
          title="MODEL_TELEMETRY"
          items={modelTelemetry}
        />
        <TelemetryPanel
          title="DATASET_INFO"
          items={datasetInfo}
        />
        
        {/* Quick Stats */}
        <div className="panel p-4">
          <div className="section-header border-b border-border pb-2 mb-3">SESSION_STATS</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="telemetry-label">Images Processed</span>
              <span className="telemetry-value">{uploadedImage ? 1 : 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="telemetry-label">Total Detections</span>
              <span className="telemetry-highlight">{detections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="telemetry-label">Avg Confidence</span>
              <span className="telemetry-value">
                {detections.length > 0 
                  ? (detections.reduce((a, b) => a + b.confidence, 0) / detections.length * 100).toFixed(1) + '%'
                  : '-'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
