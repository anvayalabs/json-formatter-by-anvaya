
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "@/hooks/use-theme";

export interface JsonColorScheme {
  key: string;
  string: string;
  number: string;
  boolean: string;
  null: string;
  background: {
    light: string;
    dark: string;
  }
}

// Default color schemes
export const defaultColorSchemes = {
  default: {
    key: '#33C3F0',      // Bright blue
    string: '#10B981',   // Green
    number: '#F97316',   // Orange
    boolean: '#8B5CF6',  // Vivid purple
    null: '#D946EF',     // Magenta pink
    background: {
      light: '#F1F1F1',  // Light background
      dark: '#0a0a0a'    // Dark background
    }
  },
  vibrant: {
    key: '#3B82F6',      // Bright blue
    string: '#22C55E',   // Vivid green
    number: '#F59E0B',   // Gold
    boolean: '#8B5CF6',  // Vivid purple
    null: '#EC4899',     // Bright pink
    background: {
      light: '#F8FAFC',  // Light background
      dark: '#020617'    // Dark background
    }
  },
  monochrome: {
    key: '#94A3B8',      // Slate
    string: '#64748B',   // Darker slate
    number: '#475569',   // Even darker slate
    boolean: '#334155',  // Almost black
    null: '#1E293B',     // Very dark slate
    background: {
      light: '#F8FAFC',  // Light background
      dark: '#0F172A'    // Dark background
    }
  },
  pastel: {
    key: '#38BDF8',      // Light blue
    string: '#4ADE80',   // Light green
    number: '#FB923C',   // Light orange
    boolean: '#A78BFA',  // Light purple
    null: '#F472B6',     // Light pink
    background: {
      light: '#F9FAFB',  // Light background
      dark: '#111827'    // Dark background
    }
  }
};

export type ColorSchemeName = keyof typeof defaultColorSchemes;

export const useThemeColors = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Store the active color scheme name
  const [activeScheme, setActiveScheme] = useLocalStorage<ColorSchemeName>(
    'json-formatter-color-scheme', 
    'default'
  );
  
  // Store custom color scheme if the user customizes colors
  const [customColors, setCustomColors] = useLocalStorage<JsonColorScheme | null>(
    'json-formatter-custom-colors',
    null
  );
  
  // Get the current color scheme (either a preset or custom)
  const currentColorScheme = customColors || defaultColorSchemes[activeScheme];
  
  // Helper to update a specific color in custom scheme
  const updateColor = (type: keyof Omit<JsonColorScheme, 'background'>, color: string) => {
    // Fix: Explicitly type the update function to return JsonColorScheme
    setCustomColors((prev: JsonColorScheme | null): JsonColorScheme => {
      const base = prev || {...defaultColorSchemes[activeScheme]};
      return {
        ...base,
        [type]: color
      };
    });
  };
  
  // Helper to update the background color
  const updateBackgroundColor = (mode: 'light' | 'dark', color: string) => {
    // Fix: Explicitly type the update function to return JsonColorScheme
    setCustomColors((prev: JsonColorScheme | null): JsonColorScheme => {
      const base = prev || {...defaultColorSchemes[activeScheme]};
      return {
        ...base,
        background: {
          ...base.background,
          [mode]: color
        }
      };
    });
  };
  
  // Reset to a preset color scheme
  const resetToPreset = (preset: ColorSchemeName) => {
    setActiveScheme(preset);
    setCustomColors(null);
  };
  
  // CSS variables for current theme
  const cssVariables = {
    '--json-key-color': currentColorScheme.key,
    '--json-string-color': currentColorScheme.string,
    '--json-number-color': currentColorScheme.number,
    '--json-boolean-color': currentColorScheme.boolean,
    '--json-null-color': currentColorScheme.null,
    '--json-background-color': isDark 
      ? currentColorScheme.background.dark 
      : currentColorScheme.background.light
  } as React.CSSProperties;
  
  return {
    activeScheme,
    currentColorScheme,
    isCustom: !!customColors,
    cssVariables,
    setActiveScheme,
    updateColor,
    updateBackgroundColor,
    resetToPreset,
    presets: defaultColorSchemes,
    isDark
  };
};
