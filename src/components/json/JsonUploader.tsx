
import React, { useState, useCallback, useRef } from "react";
import { Upload, FileType, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface JsonUploaderProps {
  onUpload: (jsonText: string) => void;
  className?: string;
}

const JsonUploader: React.FC<JsonUploaderProps> = ({ onUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const simulateProgress = () => {
    setIsLoading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
      setUploadProgress(progress);
    }, 100);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    simulateProgress();
    
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

  const cancelUpload = () => {
    setFileName(null);
    setUploadProgress(0);
    setIsLoading(false);
  };

  return (
    <div
      className={`${className} flex flex-col items-center justify-center p-4 border-2 border-dashed 
        rounded-lg transition-colors ${
        isDragging ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50 hover:bg-muted/50"
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
      
      {!fileName ? (
        <>
          <Upload className="mb-2 text-muted-foreground h-8 w-8" />
          <p className="text-sm text-center text-muted-foreground mb-3 max-w-xs">
            Drop JSON file here or browse from your computer
          </p>
          <Button variant="outline" size="sm" onClick={openFileDialog}>
            <FileType className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </>
      ) : (
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-5 w-5 mr-2 text-primary" />
              <span className="text-sm font-medium truncate max-w-[180px]">{fileName}</span>
            </div>
            {isLoading ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={cancelUpload}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          
          {isLoading ? (
            <>
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs text-center text-muted-foreground">
                Processing file...
              </p>
            </>
          ) : (
            <p className="text-xs text-center text-emerald-500 font-medium">
              Upload complete!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JsonUploader;
