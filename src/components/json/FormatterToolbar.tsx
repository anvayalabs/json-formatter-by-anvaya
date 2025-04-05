
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Code,
  Copy,
  Download,
  FileJson,
  Loader2,
  Printer,
  Settings,
  Share2,
  Sun,
  Moon,
  Trash2,
  Shrink,
  Expand,
  LayoutGrid,
  Palette,
  FileCode,
  Minimize,
  Indent,
  ToggleLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ThemeEditor from './ThemeEditor';

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
  viewMode: 'code' | 'tree';
  onViewModeChange: (mode: 'code' | 'tree') => void;
  autoUpdate: boolean;
  onAutoUpdateChange: (value: boolean) => void;
  isJsonValid: boolean;
  colorMode: 'light' | 'dark';
  onColorModeChange: (mode: 'light' | 'dark') => void;
  isMinified: boolean;
  isExpanded: boolean;
  onExpandToggle: () => void;
  onSettingsOpen: () => void;
  onShare: () => void;
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
  onExpandToggle,
  onSettingsOpen,
  onShare
}) => {
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  
  return (
    <TooltipProvider>
      <div className="border-b p-2 flex items-center justify-between flex-wrap gap-2 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isLoading}
                onClick={onFormat}
              >
                <FileCode className="h-4 w-4" />
                <span className="sr-only">Format</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Format JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isLoading}
                onClick={onMinify}
              >
                <Minimize className="h-4 w-4" />
                <span className="sr-only">Minify</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Minify JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isLoading}
                onClick={onClear}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isLoading || !isJsonValid}
                onClick={onCopy}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to Clipboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isLoading || !isJsonValid}
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isLoading || !isJsonValid}
                onClick={onPrint}
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print JSON</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-2">
            <Select
              value={indentation.toString()}
              onValueChange={(value) => onIndentationChange(parseInt(value))}
              disabled={isLoading || isMinified}
            >
              <SelectTrigger className="w-[120px] h-8">
                <Indent className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Spaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 mr-2">
            <Label htmlFor="auto-format" className="text-xs">Auto</Label>
            <Switch
              id="auto-format"
              checked={autoUpdate}
              onCheckedChange={onAutoUpdateChange}
              disabled={isLoading}
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onExpandToggle}
                disabled={viewMode !== 'tree'}
              >
                {isExpanded ? (
                  <Shrink className="h-4 w-4" />
                ) : (
                  <Expand className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isExpanded ? 'Collapse All' : 'Expand All'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('code')}
                disabled={isLoading}
              >
                <FileCode className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code View</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === 'tree' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('tree')}
                disabled={isLoading || !isJsonValid}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tree View</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setThemeEditorOpen(true)}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Theme Editor</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onColorModeChange(colorMode === 'dark' ? 'light' : 'dark')}
              >
                {colorMode === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onShare}
                disabled={!isJsonValid}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsOpen}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          {isLoading && (
            <div className="w-6 h-6 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
        
        <ThemeEditor open={themeEditorOpen} onOpenChange={setThemeEditorOpen} />
      </div>
    </TooltipProvider>
  );
};

export default FormatterToolbar;
