
import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  error?: string | null;
  isLoading?: boolean;
  preserveInput?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ 
  value, 
  onChange, 
  readOnly = false, 
  height = "100%",
  error = null,
  isLoading = false,
  preserveInput = false
}) => {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add custom editor settings
    editor.updateOptions({
      padding: { top: 10, bottom: 10 },
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      wordWrap: "on",
    });
    
    // Focus the editor if it's not readonly
    if (!readOnly) {
      editor.focus();
    }
    
    // Setup custom theme for dark mode with brighter color scheme
    monaco.editor.defineTheme('jsonDarkTheme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#0a0a0a', // Darker background
        'editor.foreground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f2',
        'editor.selectionBackground': '#44475a',
        'editor.lineHighlightBackground': '#1e1e2e',
        'editor.findMatchBackground': '#6272a4',
        'editor.findMatchHighlightBackground': '#6272a455',
        'editorLineNumber.foreground': '#565869',
        'editorLineNumber.activeForeground': '#bac2de',
        'editorBracketMatch.background': '#363846',
        'editorBracketMatch.border': '#9b87f5',
        'editorIndentGuide.background': '#2a2a3d',
        'editorIndentGuide.activeBackground': '#444455'
      },
      rules: [
        { token: 'string', foreground: '#a3ffb0', fontStyle: 'italic' }, // Brighter green
        { token: 'string.key.json', foreground: '#33C3F0', fontStyle: 'bold' }, // Brighter blue
        { token: 'string.value.json', foreground: '#a3ffb0', fontStyle: 'italic' }, // Brighter green
        { token: 'number', foreground: '#FF9F2D', fontStyle: 'bold' }, // Brighter orange
        { token: 'keyword', foreground: '#D946EF', fontStyle: 'bold' }, // Magenta pink
        { token: 'delimiter', foreground: '#d4d4d4' },
        { token: 'delimiter.bracket', foreground: '#8B5CF6' }, // Vivid purple
        { token: 'delimiter.array', foreground: '#8B5CF6' }, // Vivid purple
        { token: 'delimiter.comma', foreground: '#888888' },
        { token: 'delimiter.colon', foreground: '#0EA5E9', fontStyle: 'bold' }, // Ocean blue
        { token: 'key', foreground: '#33C3F0', fontStyle: 'bold' }, // Brighter blue
        { token: 'key.json', foreground: '#33C3F0', fontStyle: 'bold' }, // Brighter blue
        { token: 'boolean', foreground: '#D946EF', fontStyle: 'bold' }, // Magenta pink
        { token: 'null', foreground: '#8B5CF6', fontStyle: 'bold italic' }, // Vivid purple
      ]
    });
    
    // Setup custom theme for light mode with brighter color scheme
    monaco.editor.defineTheme('jsonLightTheme', {
      base: 'vs',
      inherit: true,
      colors: {
        'editor.background': '#f8f9fa',
        'editor.foreground': '#333333',
        'editorCursor.foreground': '#333333',
        'editor.selectionBackground': '#d1d1d1',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editor.findMatchBackground': '#b5d5ff',
        'editor.findMatchHighlightBackground': '#b5d5ff88',
        'editorLineNumber.foreground': '#aaaaaa',
        'editorLineNumber.activeForeground': '#333333',
        'editorBracketMatch.background': '#e8e8e8',
        'editorBracketMatch.border': '#7E69AB',
        'editorIndentGuide.background': '#e8e8e8',
        'editorIndentGuide.activeBackground': '#cccccc'
      },
      rules: [
        { token: 'string', foreground: '#10B981', fontStyle: 'italic' }, // Brighter green
        { token: 'string.key.json', foreground: '#0EA5E9', fontStyle: 'bold' }, // Brighter blue
        { token: 'string.value.json', foreground: '#10B981', fontStyle: 'italic' }, // Brighter green
        { token: 'number', foreground: '#F97316', fontStyle: 'bold' }, // Brighter orange
        { token: 'keyword', foreground: '#8B5CF6', fontStyle: 'bold' }, // Vivid purple
        { token: 'delimiter', foreground: '#546e7a' },
        { token: 'delimiter.bracket', foreground: '#8B5CF6' }, // Vivid purple
        { token: 'delimiter.array', foreground: '#8B5CF6' }, // Vivid purple
        { token: 'delimiter.comma', foreground: '#666666' },
        { token: 'delimiter.colon', foreground: '#0EA5E9', fontStyle: 'bold' }, // Ocean blue
        { token: 'key', foreground: '#0EA5E9', fontStyle: 'bold' }, // Brighter blue
        { token: 'key.json', foreground: '#0EA5E9', fontStyle: 'bold' }, // Brighter blue
        { token: 'boolean', foreground: '#8B5CF6', fontStyle: 'bold' }, // Vivid purple
        { token: 'null', foreground: '#6366F1', fontStyle: 'bold italic' }, // Brighter indigo
      ]
    });
    
    // Apply the theme based on current mode
    monaco.editor.setTheme(isDarkTheme ? 'jsonDarkTheme' : 'jsonLightTheme');
  };

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current && window.monaco) {
      window.monaco.editor.setTheme(isDarkTheme ? 'jsonDarkTheme' : 'jsonLightTheme');
    }
  }, [theme, isDarkTheme]);

  // Handle error highlighting
  useEffect(() => {
    if (editorRef.current && error) {
      // In a future version, we could mark the exact location of the error
    }
  }, [error]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {error && !isLoading && (
        <div className="p-2 bg-destructive/90 text-destructive-foreground text-sm font-medium">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Processing...</span>
          </div>
        </div>
      )}
      
      <div className="flex-1">
        <Editor
          height={height}
          language="json"
          theme={isDarkTheme ? "jsonDarkTheme" : "jsonLightTheme"}
          value={value}
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            renderLineHighlight: "all",
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            formatOnPaste: preserveInput ? false : true,
            tabSize: 2,
            folding: true,
            bracketPairColorization: {
              enabled: true
            },
          }}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        />
      </div>
    </div>
  );
};

export default JsonEditor;
