
import React, { useEffect, useState, useCallback } from "react";
import JsonEditor from "./JsonEditor";
import JsonTreeView from "./JsonTreeView";
import FormatterToolbar from "./FormatterToolbar";
import JsonUploader from "./JsonUploader";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
              body { font-family: monospace; white-space: pre; padding: 20px; }
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
      />
      
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
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <Card className="h-full border-0 rounded-none">
              {viewMode === "code" ? (
                <JsonEditor 
                  value={jsonOutput} 
                  onChange={() => {}} 
                  readOnly={true}
                />
              ) : (
                <div className="h-full overflow-auto bg-background">
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
    </div>
  );
};

export default FormatterContainer;
