
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Paintbrush, Palette, Check, RefreshCw, Save, Trash } from 'lucide-react';
import { useThemeColors, ColorSchemeName } from '@/hooks/use-theme-colors';
import { useToast } from "@/components/ui/use-toast";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border shadow-sm" 
          style={{ backgroundColor: color }}
        />
        <input 
          type="color" 
          value={color} 
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-0 border cursor-pointer"
        />
      </div>
    </div>
  );
};

interface PresetButtonProps {
  name: string;
  scheme: ColorSchemeName;
  isActive: boolean;
  onClick: () => void;
  colors: any;
}

const PresetButton: React.FC<PresetButtonProps> = ({ name, isActive, onClick, colors }) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className="flex-1 relative h-20 p-2 flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-10" 
        style={{ 
          background: `linear-gradient(45deg, ${colors.key}, ${colors.string}, ${colors.number}, ${colors.boolean})`
        }} 
      />
      <span className="text-xs font-medium z-10">{name}</span>
      {isActive && <Check className="h-4 w-4 absolute bottom-2 right-2" />}
      <div className="flex justify-between w-full z-10">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.key }} />
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.string }} />
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.number }} />
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.boolean }} />
      </div>
    </Button>
  );
};

interface SavedSchemeButtonProps {
  name: string;
  colors: any;
  onLoad: () => void;
  onDelete: () => void;
}

const SavedSchemeButton: React.FC<SavedSchemeButtonProps> = ({ name, colors, onLoad, onDelete }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 relative h-14 p-2 flex items-center justify-between"
        onClick={onLoad}
      >
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            background: `linear-gradient(45deg, ${colors.key}, ${colors.string}, ${colors.number}, ${colors.boolean})`
          }}
        />
        <span className="text-sm font-medium z-10">{name}</span>
        <div className="flex gap-1 z-10">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.key }} />
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.string }} />
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.number }} />
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.boolean }} />
        </div>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface ThemeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ open, onOpenChange }) => {
  const {
    activeScheme,
    currentColorScheme,
    isCustom,
    setActiveScheme,
    updateColor,
    updateBackgroundColor,
    resetToPreset,
    saveCustomScheme,
    loadSavedScheme,
    deleteSavedScheme,
    savedSchemes,
    presets,
    isDark
  } = useThemeColors();

  const { toast } = useToast();
  const [tab, setTab] = useState<string>("presets");
  const [schemeName, setSchemeName] = useState<string>("");

  // Update fields when the dialog opens
  useEffect(() => {
    if (open) {
      setSchemeName("");
    }
  }, [open]);

  const handleSaveScheme = () => {
    if (!schemeName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your color scheme",
        variant: "destructive"
      });
      return;
    }

    saveCustomScheme(schemeName);
    toast({
      title: "Scheme saved",
      description: `${schemeName} has been saved to your schemes`
    });
    setSchemeName("");
  };

  const handleLoadScheme = (name: string) => {
    loadSavedScheme(name);
    toast({
      title: "Scheme loaded",
      description: `${name} has been loaded`
    });
  };

  const handleDeleteScheme = (name: string) => {
    deleteSavedScheme(name);
    toast({
      title: "Scheme deleted",
      description: `${name} has been removed from your saved schemes`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            JSON Theme Editor
          </DialogTitle>
          <DialogDescription>
            Customize the colors used for JSON syntax highlighting
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="saved">My Schemes</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[350px] pr-4">
            <TabsContent value="presets" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Choose from these predefined color schemes or create your own custom theme
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(presets).map(([key, scheme]) => (
                  <PresetButton
                    key={key}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    scheme={key as ColorSchemeName}
                    isActive={activeScheme === key && !isCustom}
                    onClick={() => resetToPreset(key as ColorSchemeName)}
                    colors={scheme}
                  />
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setTab("custom")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Paintbrush className="h-4 w-4" />
                  Customize Colors
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Fine-tune the colors for each JSON element type
              </p>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">JSON Elements</h3>
                  
                  <ColorPicker 
                    label="Keys" 
                    color={currentColorScheme.key} 
                    onChange={(color) => updateColor('key', color)}
                  />
                  
                  <ColorPicker 
                    label="Strings" 
                    color={currentColorScheme.string} 
                    onChange={(color) => updateColor('string', color)}
                  />
                  
                  <ColorPicker 
                    label="Numbers" 
                    color={currentColorScheme.number} 
                    onChange={(color) => updateColor('number', color)}
                  />
                  
                  <ColorPicker 
                    label="Booleans" 
                    color={currentColorScheme.boolean} 
                    onChange={(color) => updateColor('boolean', color)}
                  />
                  
                  <ColorPicker 
                    label="Null Values" 
                    color={currentColorScheme.null} 
                    onChange={(color) => updateColor('null', color)}
                  />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Background</h3>
                  
                  <ColorPicker 
                    label={isDark ? "Dark Mode Background" : "Light Mode Background"} 
                    color={isDark ? currentColorScheme.background.dark : currentColorScheme.background.light} 
                    onChange={(color) => updateBackgroundColor(isDark ? 'dark' : 'light', color)}
                  />
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter scheme name"
                      value={schemeName}
                      onChange={(e) => setSchemeName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSaveScheme}
                      disabled={!schemeName.trim() || !isCustom}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => resetToPreset(activeScheme)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 w-full"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset to Preset
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Your saved color schemes
              </p>
              
              {Object.keys(savedSchemes).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(savedSchemes).map(([name, scheme]) => (
                    <SavedSchemeButton
                      key={name}
                      name={name}
                      colors={scheme}
                      onLoad={() => handleLoadScheme(name)}
                      onDelete={() => handleDeleteScheme(name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't saved any custom schemes yet.</p>
                  <p className="mt-2">Go to the Custom tab to create one!</p>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setTab("custom")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Paintbrush className="h-4 w-4" />
                  Create New Scheme
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeEditor;
