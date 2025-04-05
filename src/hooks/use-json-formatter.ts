
import { useState, useCallback, useRef } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

export interface FormatterSettings {
  indentation: number;
  autoUpdate: boolean;
  viewMode: "code" | "tree";
  preserveWhitespace: boolean;
  sortKeys: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
  highlightMatchingBrackets: boolean;
  isExpanded: boolean;
}

const SAMPLE_JSON = `{
  "task": "Input your JSON here"
}`;

export const useJsonFormatter = () => {
  // State for the JSON text input
  const [jsonInput, setJsonInput] = useLocalStorage("json-formatter-input", SAMPLE_JSON);
  
  // State for the formatted JSON output
  const [jsonOutput, setJsonOutput] = useState("");
  
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // State for parsed JSON data (for tree view)
  const [parsedData, setParsedData] = useState<any>(null);
  
  // State for minify mode
  const [isMinified, setIsMinified] = useState(false);

  // State tracking if JSON is valid
  const [isJsonValid, setIsJsonValid] = useState(true);
  
  // Timer ref for auto-update delay
  const autoUpdateTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Settings
  const [indentation, setIndentation] = useLocalStorage<number>("json-formatter-indentation", 2);
  const [autoUpdate, setAutoUpdate] = useLocalStorage<boolean>("json-formatter-auto-update", true);
  const [viewMode, setViewMode] = useLocalStorage<"code" | "tree">("json-formatter-view-mode", "code");
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>("json-formatter-tree-expanded", false);
  const [preserveWhitespace, setPreserveWhitespace] = useLocalStorage<boolean>("json-formatter-preserve-whitespace", false);
  const [sortKeys, setSortKeys] = useLocalStorage<boolean>("json-formatter-sort-keys", false);
  const [wordWrap, setWordWrap] = useLocalStorage<boolean>("json-formatter-word-wrap", true);
  const [showLineNumbers, setShowLineNumbers] = useLocalStorage<boolean>("json-formatter-show-line-numbers", true);
  const [highlightMatchingBrackets, setHighlightMatchingBrackets] = useLocalStorage<boolean>("json-formatter-highlight-matching", true);

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

  // Process JSON when settings change
  const processJson = useCallback(() => {
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
  }, [jsonInput, indentation, parseJson, formatJson]);

  // Handle format button click
  const handleFormat = useCallback(() => {
    processJson();
  }, [processJson]);

  // Handle minify button click
  const handleMinify = useCallback(() => {
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
  }, [jsonInput, parseJson, minifyJson]);

  // Handle clear button click
  const handleClear = useCallback(() => {
    setJsonInput("");
    setJsonOutput("");
    setParsedData(null);
    setError(null);
  }, [setJsonInput]);

  // Handle copy button click
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonOutput || jsonInput).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "JSON has been copied to clipboard"
        });
      },
      () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy to clipboard"
        });
      }
    );
  }, [jsonOutput, jsonInput, toast]);

  // Handle download button click
  const handleDownload = useCallback(() => {
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
  }, [jsonOutput, jsonInput, toast]);

  // Handle print button click
  const handlePrint = useCallback(() => {
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
                background-color: white;
                color: black;
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
  }, [jsonOutput, jsonInput]);

  // Handle file upload
  const handleUpload = useCallback((jsonText: string) => {
    setJsonInput(jsonText);
    toast({
      title: "File Uploaded",
      description: "Your JSON file has been loaded successfully"
    });
  }, [setJsonInput, toast]);

  const settings: FormatterSettings = {
    indentation,
    autoUpdate,
    viewMode,
    preserveWhitespace,
    sortKeys,
    wordWrap,
    showLineNumbers,
    highlightMatchingBrackets,
    isExpanded
  };

  const setters = {
    setIndentation,
    setAutoUpdate,
    setViewMode,
    setIsExpanded,
    setPreserveWhitespace,
    setSortKeys,
    setWordWrap,
    setShowLineNumbers,
    setHighlightMatchingBrackets
  };

  return {
    // State
    jsonInput,
    setJsonInput,
    jsonOutput,
    error,
    isLoading,
    parsedData,
    isMinified,
    isJsonValid,
    autoUpdateTimer,
    
    // Settings
    settings,
    setters,
    
    // Methods
    parseJson,
    formatJson,
    minifyJson,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
    handleDownload,
    handlePrint,
    handleUpload,
    processJson
  };
};
