
import React from "react";
import { FileJson, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center">
        <FileJson className="h-5 w-5 mr-2 text-primary" />
        <h1 className="text-xl font-bold flex items-center">
          <span className="bg-gradient-to-r from-[#1EAEDB] to-[#9b87f5] bg-clip-text text-transparent">Anvaya</span>
          <span className="text-foreground ml-1">Labs</span>
          <span className="text-foreground mx-2">|</span>
          <span className="text-foreground">JSON Formatter</span>
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
