import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

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
  height = "60vh",
  error = null,
  isLoading = false
}) => {
  const editorRef = useRef<any>(null);
  
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
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
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          fontFamily: "Menlo, Monaco, 'Courier New', monospace",
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
        }}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
      />
      {error && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-destructive text-white text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default JsonEditor;
