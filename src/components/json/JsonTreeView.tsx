
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Image as ImageIcon, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface JsonTreeViewProps {
  data: any;
  expandAll?: boolean;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, expandAll = false }) => {
  const { currentColorScheme } = useThemeColors();

  return (
    <div className="p-2 font-mono text-sm overflow-auto">
      <JsonNode 
        name="" 
        data={data} 
        isRoot={true} 
        level={0} 
        defaultExpanded={expandAll}
        colorScheme={currentColorScheme}
      />
    </div>
  );
};

interface JsonNodeProps {
  name: string;
  data: any;
  isRoot?: boolean;
  level: number;
  defaultExpanded: boolean;
  colorScheme: any;
}

const JsonNode: React.FC<JsonNodeProps> = ({ 
  name, 
  data, 
  isRoot = false, 
  level, 
  defaultExpanded,
  colorScheme
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const getType = (value: any): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const renderValue = (value: any) => {
    const type = getType(value);
    
    switch (type) {
      case "string":
        // Check if it's an image URL
        const isImageUrl = value.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) !== null;
        
        if (isImageUrl) {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-pointer hover:underline" style={{ color: colorScheme.string }}>
                    <span className="truncate max-w-[300px]">"{value}"</span>
                    <ImageIcon size={14} className="inline-block ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-1 bg-background/80 backdrop-blur-md">
                  <img 
                    src={value} 
                    alt="Preview" 
                    className="max-h-40 max-w-40 object-contain rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        
        return <span style={{ color: colorScheme.string }}>"{value}"</span>;
      
      case "number":
        return <span style={{ color: colorScheme.number }}>{value}</span>;
      
      case "boolean":
        return <span style={{ color: colorScheme.boolean }}>{value.toString()}</span>;
      
      case "null":
        return <span style={{ color: colorScheme.null }}>null</span>;
      
      case "object":
        return (
          <span className="text-muted-foreground text-xs">
            {"{}"} {Object.keys(value).length} {Object.keys(value).length === 1 ? "property" : "properties"}
          </span>
        );
      
      case "array":
        return (
          <span className="text-muted-foreground text-xs">
            {"[]"} {value.length} {value.length === 1 ? "item" : "items"}
          </span>
        );
      
      default:
        return <span>{String(value)}</span>;
    }
  };

  const renderExpandableValue = (value: any) => {
    const type = getType(value);
    
    if (type === "object" || type === "array") {
      const isEmpty = type === "object" 
        ? Object.keys(value).length === 0
        : value.length === 0;
      
      if (isEmpty) {
        return (
          <span className="ml-2 text-muted-foreground">
            {type === "object" ? "{}" : "[]"}
          </span>
        );
      }
      
      return (
        <div className="ml-6">
          {type === "object" && 
            Object.keys(value).map((key) => (
              <JsonNode
                key={key}
                name={key}
                data={value[key]}
                level={level + 1}
                defaultExpanded={defaultExpanded}
                colorScheme={colorScheme}
              />
            ))
          }
          {type === "array" && 
            value.map((item: any, index: number) => (
              <JsonNode
                key={index}
                name={index.toString()}
                data={item}
                level={level + 1}
                defaultExpanded={defaultExpanded}
                colorScheme={colorScheme}
              />
            ))
          }
        </div>
      );
    }
    
    return null;
  };

  const isExpandable = 
    getType(data) === "object" || 
    getType(data) === "array";
  
  const isEmpty = 
    (getType(data) === "object" && Object.keys(data).length === 0) ||
    (getType(data) === "array" && data.length === 0);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Return only data for root element
  if (isRoot) {
    return (
      <div className="ml-2">
        {getType(data) === "object" && 
          Object.keys(data).map((key) => (
            <JsonNode
              key={key}
              name={key}
              data={data[key]}
              level={0}
              defaultExpanded={defaultExpanded}
              colorScheme={colorScheme}
            />
          ))
        }
        {getType(data) === "array" && 
          data.map((item: any, index: number) => (
            <JsonNode
              key={index}
              name={index.toString()}
              data={item}
              level={0}
              defaultExpanded={defaultExpanded}
              colorScheme={colorScheme}
            />
          ))
        }
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "py-1 transition-colors rounded-md",
        isHovered && "bg-accent/40"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        {isExpandable && !isEmpty ? (
          <button 
            onClick={handleToggle}
            className="mr-1 mt-0.5 p-0.5 hover:bg-muted rounded focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
          >
            {isExpanded ? (
              <Minus size={14} className="text-muted-foreground" />
            ) : (
              <Plus size={14} className="text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="mr-1 w-[24px]"></span>
        )}
        
        <div className="flex-1">
          <div className="flex items-center">
            <span style={{ color: colorScheme.key }} className="mr-1">"{name}":</span> 
            {isExpandable ? (
              <span>
                {!isExpanded && renderValue(data)}
                {isExpanded && (
                  <span className="text-foreground/70">
                    {getType(data) === "object" ? "{" : "["}
                  </span>
                )}
              </span>
            ) : (
              renderValue(data)
            )}
          </div>
          
          {isExpanded && isExpandable && renderExpandableValue(data)}
          
          {isExpanded && isExpandable && !isEmpty && (
            <div className="pl-6 text-foreground/70">
              {getType(data) === "object" ? "}" : "]"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonTreeView;
