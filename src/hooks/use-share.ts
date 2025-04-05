
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useShare = (jsonOutput: string, jsonInput: string, isJsonValid: boolean) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const { toast } = useToast();

  // Handle share functionality
  const handleShare = useCallback(() => {
    try {
      if (!isJsonValid) {
        toast({
          variant: "destructive",
          title: "Invalid JSON",
          description: "Please fix the JSON errors before sharing"
        });
        return;
      }
      
      // In a real app, you'd generate a server-side URL or use a service
      // For now, we'll create a data URI that can be shared
      const jsonData = jsonOutput || jsonInput;
      const encodedJson = encodeURIComponent(jsonData);
      const dataUrl = `data:text/json;charset=utf-8,${encodedJson}`;
      
      // In a production environment, you'd use a URL shortener service
      setShareUrl(dataUrl);
      setIsUrlCopied(false);
      setShareOpen(true);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Share Error",
        description: "Could not generate shareable link"
      });
    }
  }, [jsonOutput, jsonInput, isJsonValid, toast]);
  
  const copyShareUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 2000);
      },
      () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link"
        });
      }
    );
  }, [shareUrl, toast]);

  return {
    shareOpen,
    setShareOpen,
    shareUrl,
    isUrlCopied,
    handleShare,
    copyShareUrl
  };
};
