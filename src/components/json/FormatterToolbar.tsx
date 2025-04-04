import React, { useState } from "react";
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
  Trees,
  Files,
  Share2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormatterToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
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
  onSettingsOpen?: () => void;
}

const FormatterToolbar: React.FC<FormatterToolbarProps> = ({
  onFormat,
  onMinify,
  onClear,
  onCopy,
  onDownload,
  onPrint,
  onShare,
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
  onExpandToggle,
  onSettingsOpen
}) => {
  const { toast } = useToast();
  const [showTools, setShowTools] = useState(false);
  
  const handleIndentationChange = (value: string) => {
    onIndentationChange(Number(value));
  };

  // For mobile, we need a more compact toolbar
  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-card border-b sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isMinified ? "default" : "outline"}
                size="sm" 
                onClick={isMinified ? onFormat : onMinify}
                disabled={isLoading || !isJsonValid}
                className="transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isMinified ? (
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-xs">Beautify</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Files className="h-3.5 w-3.5" />
                    <span className="text-xs">Minify</span>
                  </div>
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
                className="transition-all hover:bg-destructive/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Editor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!isMobile && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="h-8 bg-background hover:bg-background/80"
              >
                <span className="mr-1">Spaces:</span>
                <span className="font-mono">{indentation}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Indentation</div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 8].map((value) => (
                    <Button 
                      key={value}
                      variant={indentation === value ? "default" : "outline"}
                      size="sm"
                      className="w-full font-mono"
                      onClick={() => handleIndentationChange(value.toString())}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {!isMobile && (
          <div className="flex items-center space-x-2 ml-2">
            <Switch
              id="auto-update"
              checked={autoUpdate}
              onCheckedChange={onAutoUpdateChange}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label htmlFor="auto-update" className="text-xs cursor-pointer">Auto Update</Label>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange(viewMode === "code" ? "tree" : "code")}
                disabled={!isJsonValid}
                className="text-muted-foreground hover:text-foreground"
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
                className="text-muted-foreground hover:text-foreground"
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
                className="text-muted-foreground hover:text-foreground"
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
                className="text-muted-foreground hover:text-foreground"
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
                  className="text-muted-foreground hover:text-foreground"
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
                onClick={onShare}
                disabled={!isJsonValid}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share JSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
                      : "light"
                  );
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                {colorMode === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {colorMode === "light" 
                  ? "Switch to Dark Mode" 
                  : "Switch to Light Mode"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {onSettingsOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSettingsOpen}
                  className="ml-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Advanced Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default FormatterToolbar;
