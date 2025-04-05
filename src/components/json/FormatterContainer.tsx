
import React, { useEffect, useState } from "react";
import JsonEditor from "./JsonEditor";
import JsonTreeView from "./JsonTreeView";
import FormatterToolbar from "./FormatterToolbar";
import UploaderSection from "./UploaderSection";
import ShareDialog from "./ShareDialog";
import SettingsDialog from "./SettingsDialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWarning, Share2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useJsonFormatter } from "@/hooks/use-json-formatter";
import { useSettingsManager } from "@/hooks/use-settings-manager";
import { useShare } from "@/hooks/use-share";

interface FormatterContainerProps {
  // Add any props that might be needed in the future
}

// Create a settings type that matches what SettingsDialog expects
interface SettingsType {
  indentation: number;
  autoUpdate: boolean;
  colorMode: 'light' | 'dark';
  viewMode: 'code' | 'tree';
  preserveWhitespace: boolean;
  sortKeys: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
  highlightMatchingBrackets: boolean;
}

const FormatterContainer: React.FC<FormatterContainerProps> = () => {
  // Get all formatter functionality from our custom hook
  const {
    jsonInput,
    setJsonInput,
    jsonOutput,
    error,
    isLoading,
    parsedData,
    isMinified,
    isJsonValid,
    autoUpdateTimer,
    settings,
    setters,
    parseJson,
    formatJson,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
    handleDownload,
    handlePrint,
    handleUpload,
    processJson
  } = useJsonFormatter();

  // Get theme management
  const { theme: colorMode, setTheme: setColorMode } = useTheme();
  
  // Get mobile status from custom hook
  const isMobile = useIsMobile();
  
  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(false);

  // Settings management
  const {
    settingsOpen,
    setSettingsOpen,
    fileInputRef,
    exportSettings,
    importSettings,
    clearLocalStorage,
    handleSettingChange
  } = useSettingsManager(settings, setters, setColorMode, colorMode as 'light' | 'dark');

  // Sharing functionality
  const {
    shareOpen,
    setShareOpen,
    shareUrl,
    isUrlCopied,
    handleShare,
    copyShareUrl
  } = useShare(jsonOutput, jsonInput, isJsonValid);

  // Effect to process JSON when input changes
  useEffect(() => {
    if (!settings.autoUpdate) return;
    
    // Clear previous timer
    if (autoUpdateTimer.current) {
      clearTimeout(autoUpdateTimer.current);
    }
    
    // Set new timer for auto-update
    autoUpdateTimer.current = setTimeout(() => {
      processJson();
    }, 300);
    
    return () => {
      if (autoUpdateTimer.current) {
        clearTimeout(autoUpdateTimer.current);
      }
    };
  }, [jsonInput, settings.indentation, settings.autoUpdate, processJson]);

  // Convert our settings to what the SettingsDialog expects
  const settingsForDialog: SettingsType = {
    ...settings,
    colorMode: colorMode as 'light' | 'dark'
  };

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
        indentation={settings.indentation}
        onIndentationChange={setters.setIndentation}
        viewMode={settings.viewMode}
        onViewModeChange={setters.setViewMode}
        autoUpdate={settings.autoUpdate}
        onAutoUpdateChange={setters.setAutoUpdate}
        isJsonValid={isJsonValid}
        colorMode={colorMode as 'light' | 'dark'}
        onColorModeChange={setColorMode}
        isMinified={isMinified}
        isExpanded={settings.isExpanded}
        onExpandToggle={() => setters.setIsExpanded(!settings.isExpanded)}
        onSettingsOpen={() => setSettingsOpen(true)}
        onShare={handleShare}
      />

      <div className="flex items-center justify-between p-2 px-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <UploaderSection 
            uploaderOpen={uploaderOpen}
            setUploaderOpen={setUploaderOpen}
            onUpload={(jsonText) => {
              handleUpload(jsonText);
              setUploaderOpen(false);
            }}
          />
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
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="min-h-[150px] md:min-h-0"
          >
            <Card className="h-full border-0 rounded-none">
              <JsonEditor
                value={jsonInput}
                onChange={setJsonInput}
                error={error}
                isLoading={isLoading}
                preserveInput={true}
                height={isMobile ? "300px" : "100%"}
              />
            </Card>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="min-h-[150px] md:min-h-0"
          >
            <Card className="h-full border-0 rounded-none">
              {settings.viewMode === "code" ? (
                <JsonEditor 
                  value={jsonOutput} 
                  onChange={() => {}} 
                  readOnly={true}
                  height={isMobile ? "300px" : "100%"}
                />
              ) : (
                <div className="h-full overflow-auto bg-background p-2">
                  {parsedData && (
                    <JsonTreeView 
                      data={parsedData} 
                      expandAll={settings.isExpanded}
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
        settings={settingsForDialog}
        onSettingChange={handleSettingChange}
        onExportSettings={exportSettings}
        onImportSettings={() => fileInputRef.current?.click()}
        onClearLocalStorage={clearLocalStorage}
      />
      
      {/* Share Dialog */}
      <ShareDialog 
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
        isUrlCopied={isUrlCopied}
        onCopyUrl={copyShareUrl}
      />
      
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
