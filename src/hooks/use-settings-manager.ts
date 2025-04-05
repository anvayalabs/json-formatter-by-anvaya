
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormatterSettings } from "./use-json-formatter";

// Define a type for exported settings
export interface ExportedSettings extends FormatterSettings {
  colorMode: 'light' | 'dark';
  timestamp: number;
  version: string;
}

export const useSettingsManager = (
  settings: FormatterSettings,
  setters: any,
  setColorMode: (mode: 'light' | 'dark') => void,
  colorMode: 'light' | 'dark'
) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Export settings function
  const exportSettings = useCallback(() => {
    try {
      const settingsToExport: ExportedSettings = {
        ...settings,
        colorMode,
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
  }, [settings, colorMode, toast]);
  
  // Import settings function
  const importSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedSettings: ExportedSettings = JSON.parse(content);
          
          // Update all settings
          setters.setIndentation(importedSettings.indentation || 2);
          setters.setAutoUpdate(importedSettings.autoUpdate ?? true);
          setColorMode(importedSettings.colorMode || 'dark');
          setters.setViewMode(importedSettings.viewMode || 'code');
          setters.setPreserveWhitespace(importedSettings.preserveWhitespace ?? false);
          setters.setSortKeys(importedSettings.sortKeys ?? false);
          setters.setWordWrap(importedSettings.wordWrap ?? true);
          setters.setShowLineNumbers(importedSettings.showLineNumbers ?? true);
          setters.setHighlightMatchingBrackets(importedSettings.highlightMatchingBrackets ?? true);
          
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
  }, [setters, setColorMode, toast]);
  
  // Clear local storage
  const clearLocalStorage = useCallback(() => {
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
  }, [toast]);

  // Handle setting changes
  const handleSettingChange = useCallback((key: string, value: any) => {
    switch (key) {
      case 'indentation':
        setters.setIndentation(value as number);
        break;
      case 'autoUpdate':
        setters.setAutoUpdate(value as boolean);
        break;
      case 'colorMode':
        setColorMode(value as "light" | "dark");
        break;
      case 'viewMode':
        setters.setViewMode(value as "code" | "tree");
        break;
      case 'preserveWhitespace':
        setters.setPreserveWhitespace(value as boolean);
        break;
      case 'sortKeys':
        setters.setSortKeys(value as boolean);
        break;
      case 'wordWrap':
        setters.setWordWrap(value as boolean);
        break;
      case 'showLineNumbers':
        setters.setShowLineNumbers(value as boolean);
        break;
      case 'highlightMatchingBrackets':
        setters.setHighlightMatchingBrackets(value as boolean);
        break;
    }
  }, [setters, setColorMode]);

  return {
    settingsOpen,
    setSettingsOpen,
    fileInputRef,
    exportSettings,
    importSettings,
    clearLocalStorage,
    handleSettingChange
  };
};
