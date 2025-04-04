
import React, { useEffect, useState, useCallback, useRef } from "react";
import JsonEditor from "./JsonEditor";
import JsonTreeView from "./JsonTreeView";
import FormatterToolbar from "./FormatterToolbar";
import JsonUploader from "./JsonUploader";
import SettingsDialog from "./SettingsDialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Share2, Upload, FileWarning } from "lucide-react";

interface FormatterContainerProps {
  // Add any props that might be needed in the future
}

const SAMPLE_JSON = `{
  "name": "Anvaya Labs",
  "type": "Organization",
  "founded": 2020,
  "isActive": true,
  "employees": 25,
  "location": {
    "city": "San Francisco",
    "state": "California",
    "country": "USA"
  },
  "products": [
    {
      "id": 1,
      "name": "JSON Formatter",
      "version": "1.0.0",
      "features": ["formatting", "validation", "beautify", "minify"]
    },
    {
      "id": 2,
      "name": "API Tester",
      "version": "0.9.0",
      "features": ["request", "response", "headers", "auth"]
    }
  ],
  "social": {
    "twitter": "@anvayalabs",
    "github": "github.com/anvayalabs",
    "website": "https://anvaya.com"
  },
  "logo": "https://placehold.co/400",
  "nullValue": null
}`;

const FormatterContainer: React.FC<FormatterContainerProps> = () => {
  // State for the JSON text input
  const [jsonInput, setJsonInput] = useLocalStorage("json-formatter-input", SAMPLE_JSON);
  
  // State for the formatted JSON output
  const [jsonOutput, setJsonOutput] = useState("");
  
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // State for view mode (code or tree)
  const [viewMode, setViewMode] = useLocalStorage<"code" | "tree">("json-formatter-view-mode", "code");
  
  // State for parsed JSON data (for tree view)
  const [parsedData, setParsedData] = useState<any>(null);
  
  // State for indentation level
  const [indentation, setIndentation] = useLocalStorage<number>("json-formatter-indentation", 2);
  
  // State for auto update
  const [autoUpdate, setAutoUpdate] = useLocalStorage<boolean>("json-formatter-auto-update", true);
  
  // State for color mode
  const [colorMode, setColorMode] = useLocalStorage<"light" | "dark" | "system">("json-formatter-color-mode", "system");
  
  // State for minify mode
  const [isMinified, setIsMinified] = useState(false);

  // State for tree view expand/collapse
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>("json-formatter-tree-expanded", false);

  // State tracking if JSON is valid
  const [isJsonValid, setIsJsonValid] = useState(true);

  // State for settings dialog
  const [settingsOpen, setSettingsOpen] = useState(false);

  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const { toast } = useToast();

  // Effect for handling color mode
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (colorMode === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemPreference);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(colorMode);
    }
  }, [colorMode]);

  // Function to parse and validate JSON
  const parseJson = useCallback((input: string): any => {
    try {
      const trimmedInput = input.trim();
      if (!trimmedInput) {
        setError(null);
        return null;
      }
      
      const parsed = JSON.parse(trimmedInput);
      setError(null);
      setIsJsonValid(true);
      return parsed;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
      setIsJsonValid(false);
      return null;
    }
  }, []);

  // Function to format JSON
  const formatJson = useCallback((parsed: any, spaces: number) => {
    try {
      if (parsed === null) return "";
      
      const formatted = JSON.stringify(parsed, null, spaces);
      setIsMinified(false);
      return formatted;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error formatting JSON";
      setError(errorMessage);
      return "";
    }
  }, []);

  // Function to minify JSON
  const minifyJson = useCallback((parsed: any) => {
    try {
      if (parsed === null) return "";
      
      const minified = JSON.stringify(parsed);
      setIsMinified(true);
      return minified;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error minifying JSON";
      setError(errorMessage);
      return "";
    }
  }, []);

  // Effect to process JSON when input changes
  useEffect(() => {
    if (!autoUpdate) return;
    
    const timer = setTimeout(() => {
      setIsLoading(true);
      try {
        const parsed = parseJson(jsonInput);
        setParsedData(parsed);
        
        if (parsed !== null) {
          const formatted = formatJson(parsed, indentation);
          setJsonOutput(formatted);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [jsonInput, indentation, autoUpdate, parseJson, formatJson]);

  // Handle format button click
  const handleFormat = () => {
    setIsLoading(true);
    try {
      const parsed = parseJson(jsonInput);
      setParsedData(parsed);
      
      if (parsed !== null) {
        const formatted = formatJson(parsed, indentation);
        setJsonOutput(formatted);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle minify button click
  const handleMinify = () => {
    setIsLoading(true);
    try {
      const parsed = parseJson(jsonInput);
      setParsedData(parsed);
      
      if (parsed !== null) {
        const minified = minifyJson(parsed);
        setJsonOutput(minified);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setJsonInput("");
    setJsonOutput("");
    setParsedData(null);
    setError(null);
  };

  // Handle copy button click
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput || jsonInput).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "JSON has been copied to clipboard"
        });
      },
      (err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy to clipboard"
        });
      }
    );
  };

  // Handle download button click
  const handleDownload = () => {
    const blob = new Blob([jsonOutput || jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-json.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "JSON Downloaded",
      description: "Your JSON file has been downloaded successfully"
    });
  };

  // Handle print button click
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>JSON Print</title>
            <style>
              body { 
                font-family: monospace; 
                white-space: pre; 
                padding: 20px;
                background-color: ${colorMode === 'dark' ? '#1e1e1e' : 'white'};
                color: ${colorMode === 'dark' ? '#d4d4d4' : 'black'};
              }
              @media print {
                body { 
                  font-size: 12pt;
                  color: black;
                  background-color: white;
                }
              }
            </style>
          </head>
          <body>
            ${(jsonOutput || jsonInput).replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle file upload
  const handleUpload = (jsonText: string) => {
    setJsonInput(jsonText);
    setUploaderOpen(false);
    toast({
      title: "File Uploaded",
      description: "Your JSON file has been loaded successfully"
    });
  };

  // Handle setting changes
  const handleSettingChange = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    switch (key) {
      case 'indentation':
        setIndentation(value as number);
        break;
      case 'autoUpdate':
        setAutoUpdate(value as boolean);
        break;
      case 'colorMode':
        setColorMode(value as "light" | "dark" | "system");
        break;
      case 'viewMode':
        setViewMode(value as "code" | "tree");
        break;
    }
  };

  // Settings object for the dialog
  const settings = {
    indentation,
    autoUpdate,
    colorMode,
    viewMode,
  };

  // Share JSON functionality
  const handleShare = () => {
    // In a real app, this could generate a shareable URL
    toast({
      title: "Share Feature",
      description: "Shareable link feature would be implemented here"
    });
  };

  // Determine if layout should be horizontal or vertical (for mobile)
  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full h-full flex flex-col">
      <FormatterToolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        onClear={handleClear}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onPrint={handlePrint}
        isLoading={isLoading}
        indentation={indentation}
        onIndentationChange={setIndentation}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        autoUpdate={autoUpdate}
        onAutoUpdateChange={setAutoUpdate}
        isJsonValid={isJsonValid}
        colorMode={colorMode}
        onColorModeChange={setColorMode}
        isMinified={isMinified}
        isExpanded={isExpanded}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <div className="flex items-center justify-between p-2 px-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <Collapsible
            open={uploaderOpen}
            onOpenChange={setUploaderOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Upload className="h-4 w-4 mr-1" />
                Upload JSON
                {uploaderOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-2 bg-card rounded-md border shadow-sm">
              <JsonUploader onUpload={handleUpload} className="h-32" />
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center text-xs text-destructive font-medium">
              <FileWarning className="h-4 w-4 mr-1" />
              Invalid JSON
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={!isJsonValid}
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full"
        >
          <ResizablePanel defaultSize={50} minSize={30}>
            <Card className="h-full border-0 rounded-none">
              <JsonEditor
                value={jsonInput}
                onChange={setJsonInput}
                error={error}
                isLoading={isLoading}
              />
            </Card>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <Card className="h-full border-0 rounded-none">
              {viewMode === "code" ? (
                <JsonEditor 
                  value={jsonOutput} 
                  onChange={() => {}} 
                  readOnly={true}
                />
              ) : (
                <div className="h-full overflow-auto bg-background p-2">
                  {parsedData && (
                    <JsonTreeView 
                      data={parsedData} 
                      expandAll={isExpanded}
                    />
                  )}
                </div>
              )}
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingChange={handleSettingChange}
      />
    </div>
  );
};

export default FormatterContainer;
