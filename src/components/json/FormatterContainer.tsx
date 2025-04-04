
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, Share2, Upload, FileWarning, Copy, Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface FormatterContainerProps {
  // Add any props that might be needed in the future
}

// Define the SettingsType interface to be consistent with SettingsDialog
interface SettingsType {
  indentation: number;
  autoUpdate: boolean;
  colorMode: 'light' | 'dark' | 'system';
  viewMode: 'code' | 'tree';
  preserveWhitespace: boolean;
  sortKeys: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
  highlightMatchingBrackets: boolean;
}

// Define a type for exported settings
interface ExportedSettings extends SettingsType {
  timestamp: number;
  version: string;
}

const SAMPLE_JSON = `{
  "task": "Input your JSON here"
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
  
  // Use theme hook instead of local state
  const { theme: colorMode, setTheme: setColorMode } = useTheme();
  
  // State for minify mode
  const [isMinified, setIsMinified] = useState(false);

  // State for tree view expand/collapse
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>("json-formatter-tree-expanded", false);

  // State tracking if JSON is valid
  const [isJsonValid, setIsJsonValid] = useState(true);

  // State for settings dialog
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // State for share dialog
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  
  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(false);
  
  // Advanced settings
  const [preserveWhitespace, setPreserveWhitespace] = useLocalStorage<boolean>("json-formatter-preserve-whitespace", false);
  const [sortKeys, setSortKeys] = useLocalStorage<boolean>("json-formatter-sort-keys", false);
  const [wordWrap, setWordWrap] = useLocalStorage<boolean>("json-formatter-word-wrap", true);
  const [showLineNumbers, setShowLineNumbers] = useLocalStorage<boolean>("json-formatter-show-line-numbers", true);
  const [highlightMatchingBrackets, setHighlightMatchingBrackets] = useLocalStorage<boolean>("json-formatter-highlight-matching", true);

  const { toast } = useToast();
  
  // Timer ref for auto-update delay
  const autoUpdateTimer = useRef<NodeJS.Timeout | null>(null);

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
      
      // Sort keys if enabled
      if (sortKeys) {
        const sortObjectKeys = (obj: any): any => {
          if (obj === null) return null;
          if (typeof obj !== 'object') return obj;
          
          if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
          }
          
          return Object.keys(obj)
            .sort()
            .reduce((result: any, key) => {
              result[key] = sortObjectKeys(obj[key]);
              return result;
            }, {});
        };
        
        parsed = sortObjectKeys(parsed);
      }
      
      const formatted = JSON.stringify(parsed, null, spaces);
      setIsMinified(false);
      return formatted;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error formatting JSON";
      setError(errorMessage);
      return "";
    }
  }, [sortKeys]);

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
    
    // Clear previous timer
    if (autoUpdateTimer.current) {
      clearTimeout(autoUpdateTimer.current);
    }
    
    // Set new timer for auto-update
    autoUpdateTimer.current = setTimeout(() => {
      setIsLoading(true);
      try {
        const parsed = parseJson(jsonInput);
        setParsedData(parsed);
        
        if (parsed !== null) {
          const formatted = formatJson(parsed, indentation);
          setJsonOutput(formatted);
        } else {
          setJsonOutput("");
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => {
      if (autoUpdateTimer.current) {
        clearTimeout(autoUpdateTimer.current);
      }
    };
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
      } else {
        setJsonOutput("");
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
      } else {
        setJsonOutput("");
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
  
  // Handle share functionality
  const handleShare = () => {
    try {
      if (!isJsonValid) {
        toast({
          variant: "destructive",
          title: "Invalid JSON",
          description: "Please fix the JSON errors before sharing"
        });
        return;
      }
      
      // In a real app, you'd generate a server-side URL or use a service
      // For now, we'll create a data URI that can be shared
      const jsonData = jsonOutput || jsonInput;
      const encodedJson = encodeURIComponent(jsonData);
      const dataUrl = `data:text/json;charset=utf-8,${encodedJson}`;
      
      // In a production environment, you'd use a URL shortener service
      // For now, we'll just show this data URL
      setShareUrl(dataUrl);
      setIsUrlCopied(false);
      setShareOpen(true);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Share Error",
        description: "Could not generate shareable link"
      });
    }
  };
  
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 2000);
      },
      (err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link"
        });
      }
    );
  };

  // Export settings function
  const exportSettings = () => {
    try {
      const settingsToExport: ExportedSettings = {
        indentation,
        autoUpdate,
        colorMode: colorMode as 'light' | 'dark' | 'system',
        viewMode,
        preserveWhitespace,
        sortKeys,
        wordWrap,
        showLineNumbers,
        highlightMatchingBrackets,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      
      const settingsJson = JSON.stringify(settingsToExport, null, 2);
      const blob = new Blob([settingsJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "json-formatter-settings.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Settings Exported",
        description: "Your settings have been saved to a file"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not export settings"
      });
    }
  };
  
  // Import settings function
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedSettings: ExportedSettings = JSON.parse(content);
          
          // Update all settings
          setIndentation(importedSettings.indentation || 2);
          setAutoUpdate(importedSettings.autoUpdate ?? true);
          setColorMode(importedSettings.colorMode || 'system');
          setViewMode(importedSettings.viewMode || 'code');
          setPreserveWhitespace(importedSettings.preserveWhitespace ?? false);
          setSortKeys(importedSettings.sortKeys ?? false);
          setWordWrap(importedSettings.wordWrap ?? true);
          setShowLineNumbers(importedSettings.showLineNumbers ?? true);
          setHighlightMatchingBrackets(importedSettings.highlightMatchingBrackets ?? true);
          
          toast({
            title: "Settings Imported",
            description: "Your settings have been successfully imported"
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "The imported file is not valid settings file"
          });
        }
      };
      
      reader.readAsText(file);
      
      // Reset the file input
      event.target.value = '';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Could not import settings"
      });
    }
  };
  
  // Clear local storage
  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      toast({
        title: "Local Storage Cleared",
        description: "All stored settings have been reset to defaults"
      });
      
      // Reload the page to reset all states
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: "Could not clear local storage"
      });
    }
  };

  // Handle setting changes
  const handleSettingChange = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
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
      case 'preserveWhitespace':
        setPreserveWhitespace(value as boolean);
        break;
      case 'sortKeys':
        setSortKeys(value as boolean);
        break;
      case 'wordWrap':
        setWordWrap(value as boolean);
        break;
      case 'showLineNumbers':
        setShowLineNumbers(value as boolean);
        break;
      case 'highlightMatchingBrackets':
        setHighlightMatchingBrackets(value as boolean);
        break;
    }
  };

  // Settings object for the dialog
  const settings: SettingsType = {
    indentation,
    autoUpdate,
    colorMode: colorMode as 'light' | 'dark' | 'system',
    viewMode,
    preserveWhitespace,
    sortKeys,
    wordWrap,
    showLineNumbers,
    highlightMatchingBrackets,
  };
  
  // Hidden file input for settings import
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        colorMode={colorMode as 'light' | 'dark' | 'system'}
        onColorModeChange={setColorMode}
        isMinified={isMinified}
        isExpanded={isExpanded}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
        onSettingsOpen={() => setSettingsOpen(true)}
        onShare={handleShare}
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
                preserveInput={true}
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
        onExportSettings={exportSettings}
        onImportSettings={() => fileInputRef.current?.click()}
        onClearLocalStorage={clearLocalStorage}
      />
      
      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share JSON</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your JSON data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">Link</Label>
              <Input
                id="link"
                defaultValue={shareUrl}
                readOnly
                className="w-full"
              />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyShareUrl}>
              {isUrlCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      
      {/* Hidden file input for settings import */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={importSettings}
      />
    </div>
  );
};

export default FormatterContainer;
