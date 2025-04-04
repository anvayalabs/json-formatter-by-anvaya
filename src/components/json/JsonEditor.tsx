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
    
    // Setup custom theme for dark mode
    monaco.editor.defineTheme('jsonDarkTheme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#1e1e2e',
        'editor.foreground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f2',
        'editor.selectionBackground': '#44475a',
        'editor.lineHighlightBackground': '#2a2a3d',
      },
      rules: [
        { token: 'string', foreground: '#a3be8c' },
        { token: 'number', foreground: '#f97316' },
        { token: 'keyword', foreground: '#9b87f5' },
        { token: 'delimiter', foreground: '#d4d4d4' },
        { token: 'key', foreground: '#1EAEDB' },
        { token: 'boolean', foreground: '#9b87f5' },
        { token: 'null', foreground: '#8E9196' },
      ]
    });
    
    // Setup custom theme for light mode
    monaco.editor.defineTheme('jsonLightTheme', {
      base: 'vs',
      inherit: true,
      colors: {
        'editor.background': '#f8f9fa',
        'editor.foreground': '#333333',
        'editorCursor.foreground': '#333333',
        'editor.selectionBackground': '#d1d1d1',
        'editor.lineHighlightBackground': '#f0f0f0',
      },
      rules: [
        { token: 'string', foreground: '#388e3c' },
        { token: 'number', foreground: '#e65100' },
        { token: 'keyword', foreground: '#673ab7' },
        { token: 'delimiter', foreground: '#546e7a' },
        { token: 'key', foreground: '#0277bd' },
        { token: 'boolean', foreground: '#673ab7' },
        { token: 'null', foreground: '#616161' },
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
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Processing...</span>
          </div>
        </div>
      )}
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
      {error && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-destructive/80 backdrop-blur-sm text-destructive-foreground text-sm font-medium">
          {error}
        </div>
      )}
    </div>
  );
};

export default JsonEditor;
