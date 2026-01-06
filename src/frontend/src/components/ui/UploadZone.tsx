import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File) => void;
  className?: string;
}

export function UploadZone({ label, accept = "image/*", onFileSelect, className }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <label
      className={cn(
        "upload-zone flex flex-col items-center justify-center p-8 cursor-pointer",
        isDragging && "upload-zone-active",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload size={24} className="text-muted-foreground mb-3" />
      <span className="font-mono text-xs text-muted-foreground tracking-wide">
        {label}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground/60 mt-1">
        DRAG & DROP OR CLICK TO BROWSE
      </span>
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
    </label>
  );
}
