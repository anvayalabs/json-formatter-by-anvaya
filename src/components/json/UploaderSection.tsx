
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Upload } from "lucide-react";
import JsonUploader from "./JsonUploader";

interface UploaderSectionProps {
  uploaderOpen: boolean;
  setUploaderOpen: (open: boolean) => void;
  onUpload: (jsonText: string) => void;
}

const UploaderSection: React.FC<UploaderSectionProps> = ({
  uploaderOpen,
  setUploaderOpen,
  onUpload
}) => {
  return (
    <Collapsible
      open={uploaderOpen}
      onOpenChange={setUploaderOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Upload className="h-4 w-4 mr-1" />
          Upload JSON
          {uploaderOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 p-2 bg-card rounded-md border shadow-sm">
        <JsonUploader onUpload={onUpload} className="h-32" />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UploaderSection;
