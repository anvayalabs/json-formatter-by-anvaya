
import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  error?: string | null;
  isLoading?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ 
  value, 
  onChange, 
  readOnly = false, 
  height = "100%",
  error = null,
  isLoading = false
}) => {
  const editorRef = useRef<any>(null);
  
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
    });
    
    // Focus the editor if it's not readonly
    if (!readOnly) {
      editor.focus();
    }
    
    // Setup custom theme
    monaco.editor.defineTheme('customTheme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#1e1e2e',
      },
      rules: [
        { token: 'string', foreground: '#a3be8c' },
        { token: 'number', foreground: '#f97316' },
        { token: 'keyword', foreground: '#9b87f5' }
      ]
    });
    
    // Apply the theme
    monaco.editor.setTheme('customTheme');
  };

  useEffect(() => {
    if (editorRef.current && error) {
      // Monaco editor has APIs to highlight errors, but we're keeping it simple for now
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
        theme="vs-dark"
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
          formatOnPaste: true,
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
