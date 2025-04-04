
import React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-[#1EAEDB] to-[#9b87f5] bg-clip-text text-transparent">Anvaya</span>
          <span className="text-foreground"> JSON Formatter</span>
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
