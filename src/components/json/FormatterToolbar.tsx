
import React from "react";
import { 
  Code, 
  Copy, 
  Download, 
  FileDown, 
  Loader2, 
  Maximize2,
  Minimize2, 
  Moon, 
  Printer, 
  RotateCcw, 
  Settings,
  Sun, 
  Trees
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FormatterToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onPrint: () => void;
  isLoading: boolean;
  indentation: number;
  onIndentationChange: (value: number) => void;
  viewMode: "code" | "tree";
  onViewModeChange: (mode: "code" | "tree") => void;
  autoUpdate: boolean;
  onAutoUpdateChange: (value: boolean) => void;
  isJsonValid: boolean;
  colorMode: "light" | "dark" | "system";
  onColorModeChange: (mode: "light" | "dark" | "system") => void;
  isMinified: boolean;
  isExpanded: boolean;
  onExpandToggle: () => void;
}

const FormatterToolbar: React.FC<FormatterToolbarProps> = ({
  onFormat,
  onMinify,
  onClear,
  onCopy,
  onDownload,
  onPrint,
  isLoading,
  indentation,
  onIndentationChange,
  viewMode,
  onViewModeChange,
  autoUpdate,
  onAutoUpdateChange,
  isJsonValid,
  colorMode,
  onColorModeChange,
  isMinified,
  isExpanded,
  onExpandToggle
}) => {
  const { toast } = useToast();
  
  const handleIndentationChange = (value: string) => {
    onIndentationChange(Number(value));
  };

  // For mobile, we need a more compact toolbar
  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={isMinified ? onFormat : onMinify}
                disabled={isLoading || !isJsonValid}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isMinified ? (
                  <span className="text-xs">Beautify</span>
                ) : (
                  <span className="text-xs">Minify</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMinified ? "Beautify JSON" : "Minify JSON"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClear}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!isMobile && (
          <Select value={indentation.toString()} onValueChange={handleIndentationChange}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Indent: 2 spaces" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Indent: 2 spaces</SelectItem>
              <SelectItem value="3">Indent: 3 spaces</SelectItem>
              <SelectItem value="4">Indent: 4 spaces</SelectItem>
              <SelectItem value="8">Indent: 8 spaces</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-update" className="text-xs">Auto Update</Label>
            <Switch
              id="auto-update"
              checked={autoUpdate}
              onCheckedChange={onAutoUpdateChange}
            />
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange(viewMode === "code" ? "tree" : "code")}
                disabled={!isJsonValid}
              >
                {viewMode === "code" ? (
                  <Trees className="h-4 w-4" />
                ) : (
                  <Code className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to {viewMode === "code" ? "Tree" : "Code"} View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpandToggle}
                disabled={viewMode !== "tree" || !isJsonValid}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isExpanded ? "Collapse All" : "Expand All"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                disabled={!isJsonValid}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to Clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                disabled={!isJsonValid}
              >
                <FileDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download JSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrint}
                  disabled={!isJsonValid}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onColorModeChange(
                    colorMode === "light" 
                      ? "dark" 
                      : colorMode === "dark" 
                        ? "system" 
                        : "light"
                  );
                }}
              >
                {colorMode === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : colorMode === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <div className="relative h-4 w-4">
                    <Sun className="h-4 w-4 absolute top-0 left-0" />
                    <Moon className="h-4 w-4 absolute -bottom-1 -right-1 scale-75" />
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {colorMode === "light" 
                  ? "Switch to Dark Mode" 
                  : colorMode === "dark" 
                    ? "Switch to System Preference" 
                    : "Switch to Light Mode"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default FormatterToolbar;
