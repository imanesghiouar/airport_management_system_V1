import { useState } from "react";
import { TelemetryPanel } from "@/components/ui/TelemetryPanel";
import { UploadZone } from "@/components/ui/UploadZone";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Layers, RotateCcw } from "lucide-react";

interface ClassificationResult {
  manufacturer: string;
  family: string;
  variant: string;
  confidence: number;
}

const modelSpecs = [
  { label: "Architecture", value: "Custom CNN" },
  { label: "Conv Blocks", value: "50 layers" },
  { label: "Output Classes", value: "100 variants" },
  { label: "Test Accuracy", value: "50.0%", highlight: true },
  { label: "Parameters", value: "25.6M" },
  { label: "Dataset", value: "FGVC-Aircraft" },
];

const mockResult: ClassificationResult = {
  manufacturer: "Boeing",
  family: "737",
  variant: "737-800",
  confidence: 0.89,
};

const hierarchyColumns = [
  { key: "level", label: "Hierarchy Level" },
  { key: "prediction", label: "Prediction", highlight: true },
  { key: "confidence", label: "Confidence" },
];

export default function ClassificationLab() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const handleFileSelect = async (file: File) => {
  setUploadedImage(URL.createObjectURL(file));
  setIsProcessing(true);

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:5000/classify', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResult(data);
  } catch (error) {
    console.error("Classification Error:", error);
  } finally {
    setIsProcessing(false);
  }
};

  const handleReset = () => {
    setUploadedImage(null);
    setResult(null);
  };

  const hierarchyData = result ? [
    { level: "MANUFACTURER", prediction: result.manufacturer, confidence: `${(result.confidence * 100).toFixed(1)}%` },
    { level: "FAMILY", prediction: result.family, confidence: `${(result.confidence * 95).toFixed(1)}%` },
    { level: "VARIANT", prediction: result.variant, confidence: `${(result.confidence * 89).toFixed(1)}%` },
  ] : [];

  return (
    <div className="min-h-screen p-6 flex">
      {/* Main Content Area */}
      <div className="flex-1 mr-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-xl text-foreground tracking-wide flex items-center gap-3">
              <Layers size={20} className="text-primary" />
              CLASSIFICATION LAB
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              FINE-GRAINED AIRCRAFT CLASSIFICATION • FGVC-AIRCRAFT
            </p>
          </div>
          <StatusBadge 
            status={isProcessing ? "processing" : "online"} 
            label={isProcessing ? "Classifying..." : "Ready"} 
          />
        </div>

        {/* Upload & Preview Area */}
        <div className="grid grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div className="panel relative h-80">
            {!uploadedImage ? (
              <UploadZone
                label="INPUT_CROPPED_AIRCRAFT"
                accept="image/*"
                onFileSelect={handleFileSelect}
                className="absolute inset-0 h-full"
              />
            ) : (
              <div className="relative h-full p-4">
                <img
                  src={uploadedImage}
                  alt="Aircraft input"
                  className="w-full h-full object-contain"
                />
                <button 
                  className="absolute bottom-4 right-4 btn-industrial flex items-center gap-2"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} />
                  RESET
                </button>
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <span className="font-mono text-xs text-muted-foreground">
                        CLASSIFYING...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result Preview */}
          <div className="panel p-6 h-80 flex flex-col">
            <div className="section-header border-b border-border pb-2 mb-4">
              CLASSIFICATION_OUTPUT
            </div>
            
            {result ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="font-mono text-xs text-muted-foreground mb-1">
                    IDENTIFIED AIRCRAFT
                  </div>
                  <div className="font-mono text-2xl text-primary">
                    {result.variant}
                  </div>
                  <div className="font-mono text-sm text-muted-foreground mt-1">
                    {result.manufacturer} {result.family} Series
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-3xl text-foreground">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-1">
                      CONFIDENCE
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <span className="font-mono text-xs text-muted-foreground">
                  AWAITING INPUT...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hierarchical Results */}
        {result && (
          <div className="mt-6">
            <DataTable
              columns={hierarchyColumns}
              data={hierarchyData}
            />
          </div>
        )}
      </div>

      {/* Right Sidebar - Telemetry */}
      <div className="w-72 space-y-4">
        <TelemetryPanel
          title="MODEL_SPECS"
          items={modelSpecs}
        />
        
        <div className="panel p-4">
          <div className="section-header border-b border-border pb-2 mb-3">DATASET_INFO</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="telemetry-label">Dataset</span>
              <span className="telemetry-value">FGVC-Aircraft</span>
            </div>
            <div className="flex justify-between">
              <span className="telemetry-label">Manufacturers</span>
              <span className="telemetry-value">30</span>
            </div>
            <div className="flex justify-between">
              <span className="telemetry-label">Families</span>
              <span className="telemetry-value">70</span>
            </div>
            <div className="flex justify-between">
              <span className="telemetry-label">Variants</span>
              <span className="telemetry-highlight">100</span>
            </div>
            <div className="flex justify-between">
              <span className="telemetry-label">Total Images</span>
              <span className="telemetry-value">10,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
