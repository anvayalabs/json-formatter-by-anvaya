
import React from 'react';
import { Settings, HelpCircle, Share2, Download, Save, Code, FileJson, ArrowUpDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsType {
  indentation: number;
  autoUpdate: boolean;
  colorMode: 'light' | 'dark' | 'system';
  viewMode: 'code' | 'tree';
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SettingsType;
  onSettingChange: <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  settings,
  onSettingChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            JSON Formatter Settings
          </DialogTitle>
          <DialogDescription>
            Configure advanced options for the JSON formatter
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] pr-4">
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Indentation</h4>
                  <RadioGroup
                    value={settings.indentation.toString()}
                    onValueChange={(value) => onSettingChange('indentation', parseInt(value))}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="2" id="indent-2" />
                      <Label htmlFor="indent-2">2 spaces</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="3" id="indent-3" />
                      <Label htmlFor="indent-3">3 spaces</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="4" id="indent-4" />
                      <Label htmlFor="indent-4">4 spaces</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="8" id="indent-8" />
                      <Label htmlFor="indent-8">8 spaces</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Auto Update</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Format JSON as you type</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically format and validate JSON content when typing
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoUpdate}
                      onCheckedChange={(value) => onSettingChange('autoUpdate', value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Default View</h4>
                  <RadioGroup
                    value={settings.viewMode}
                    onValueChange={(value) => 
                      onSettingChange('viewMode', value as 'code' | 'tree')
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="code" id="view-code" />
                      <Label htmlFor="view-code" className="flex items-center gap-1.5">
                        <Code className="h-4 w-4" />
                        Code View
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="tree" id="view-tree" />
                      <Label htmlFor="view-tree" className="flex items-center gap-1.5">
                        <FileJson className="h-4 w-4" />
                        Tree View
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Color Theme</h4>
                <RadioGroup
                  value={settings.colorMode}
                  onValueChange={(value) => 
                    onSettingChange('colorMode', value as 'light' | 'dark' | 'system')
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System Preference</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Editor Preferences</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-line-numbers">Show line numbers</Label>
                    <Switch id="show-line-numbers" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="word-wrap">Word wrap</Label>
                    <Switch id="word-wrap" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-matching">Highlight matching brackets</Label>
                    <Switch id="highlight-matching" defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Advanced Options</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="preserve-whitespace">Preserve whitespace</Label>
                      <p className="text-xs text-muted-foreground">
                        Keep custom whitespace when formatting
                      </p>
                    </div>
                    <Switch id="preserve-whitespace" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sort-keys">Sort object keys</Label>
                      <p className="text-xs text-muted-foreground">
                        Alphabetically sort keys when formatting
                      </p>
                    </div>
                    <Switch id="sort-keys" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Data Management</h4>
                <div className="flex justify-between space-x-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
                <Button variant="destructive" size="sm" className="w-full">
                  Clear Local Storage
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-xs text-muted-foreground text-center">
                  JSON Formatter v1.0 • Made with ♥ by Anvaya Labs
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
