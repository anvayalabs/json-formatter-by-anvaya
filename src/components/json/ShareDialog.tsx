
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  isUrlCopied: boolean;
  onCopyUrl: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  shareUrl,
  isUrlCopied,
  onCopyUrl
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share JSON</DialogTitle>
          <DialogDescription>
            Anyone with this link can view your JSON data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">Link</Label>
            <Input
              id="link"
              defaultValue={shareUrl}
              readOnly
              className="w-full"
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={onCopyUrl}>
            {isUrlCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
