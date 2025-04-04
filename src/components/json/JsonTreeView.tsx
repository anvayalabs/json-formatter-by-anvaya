
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Image as ImageIcon, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface JsonTreeViewProps {
  data: any;
  expandAll?: boolean;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, expandAll = false }) => {
  return (
    <div className="p-2 font-mono text-sm overflow-auto">
      <JsonNode 
        name="" 
        data={data} 
        isRoot={true} 
        level={0} 
        defaultExpanded={expandAll} 
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
}

const JsonNode: React.FC<JsonNodeProps> = ({ 
  name, 
  data, 
  isRoot = false, 
  level, 
  defaultExpanded 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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
                  <span className="text-[#F2FCE2] flex items-center gap-1 cursor-pointer">
                    "{value}" <ImageIcon size={14} className="inline-block ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-0">
                  <img 
                    src={value} 
                    alt="Preview" 
                    className="max-h-40 max-w-40 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        
        return <span className="text-[#F2FCE2]">"{value}"</span>;
      
      case "number":
        return <span className="text-[#F97316]">{value}</span>;
      
      case "boolean":
        return <span className="text-[#9b87f5]">{value.toString()}</span>;
      
      case "null":
        return <span className="text-[#8E9196]">null</span>;
      
      case "object":
        return (
          <span className="text-foreground">
            {"{}"} {Object.keys(value).length} {Object.keys(value).length === 1 ? "property" : "properties"}
          </span>
        );
      
      case "array":
        return (
          <span className="text-foreground">
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
          <span className="ml-2">
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
            />
          ))
        }
      </div>
    );
  }

  return (
    <div className={cn("py-1", { "pb-0": isExpanded && isExpandable && !isEmpty })}>
      <div className="flex items-start">
        {isExpandable && !isEmpty ? (
          <button 
            onClick={handleToggle}
            className="mr-1 mt-0.5 p-0.5 hover:bg-muted rounded focus:outline-none"
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
            <span className="text-[#1EAEDB] mr-1">"{name}":</span> 
            {isExpandable ? (
              <span>
                {!isExpanded && renderValue(data)}
                {isExpanded && (getType(data) === "object" ? "{" : "[")}
              </span>
            ) : (
              renderValue(data)
            )}
          </div>
          
          {isExpanded && isExpandable && renderExpandableValue(data)}
          
          {isExpanded && isExpandable && !isEmpty && (
            <div className="pl-6">
              {getType(data) === "object" ? "}" : "]"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonTreeView;
