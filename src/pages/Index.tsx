
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
      <footer className="text-center p-2 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Anvaya Labs. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
