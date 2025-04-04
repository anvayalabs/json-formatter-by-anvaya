
import React from "react";
import FormatterContainer from "@/components/json/FormatterContainer";
import Header from "@/components/layout/Header";

const Index: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        <FormatterContainer />
      </main>
      <footer className="text-center p-3 text-xs bg-muted/30 border-t text-muted-foreground flex items-center justify-center gap-1">
        <span>© {new Date().getFullYear()} Anvaya Labs</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <span>An Interactive JSON Formatter & Validator</span>
      </footer>
    </div>
  );
};

export default Index;
