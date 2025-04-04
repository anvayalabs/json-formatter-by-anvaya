
import React, { useState, useCallback, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JsonUploaderProps {
  onUpload: (jsonText: string) => void;
  className?: string;
}

const JsonUploader: React.FC<JsonUploaderProps> = ({ onUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpload(e.target.result.toString());
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === "application/json" || file.name.endsWith(".json") || file.name.endsWith(".txt")) {
          processFile(file);
        }
      }
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        processFile(file);
      }
    },
    [onUpload]
  );

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`${className} flex flex-col items-center justify-center p-4 border-2 border-dashed 
        rounded-lg transition-colors ${
        isDragging ? "bg-muted border-primary" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        accept=".json,.txt"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Upload className="mb-2 text-muted-foreground" size={24} />
      <p className="text-sm text-center text-muted-foreground mb-2">
        Drop JSON file here or
      </p>
      <Button variant="outline" size="sm" onClick={openFileDialog}>
        Browse Files
      </Button>
    </div>
  );
};

export default JsonUploader;
