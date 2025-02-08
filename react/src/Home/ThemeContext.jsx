// src/components/ThemeContext.jsx
import { createContext, useContext, useState } from "react";

/**
 * NOTE:
 * Tailwind classes (e.g. 'bg-[#040B14]/90') won't work directly in Monaco.
 * Each theme here also provides explicit HEX codes for Monaco:
 * - monacoBackground
 * - monacoForeground
 * - monacoComment
 * - monacoKeyword
 * - monacoString
 */
export const themes = {
  quantum: {
    name: "Quantum",
    primary: "from-blue-400 via-indigo-500 to-purple-600",
    secondary: "from-violet-400 to-blue-600",
    accent: "from-purple-400 to-indigo-600",
    background: "bg-gradient-to-br from-[#040B14] to-[#0A192F]",
    glass: "bg-[#0A192F]/10 backdrop-blur-xl border border-blue-500/20",
    panel: "bg-[#040B14]/20 backdrop-blur-xl border border-indigo-400/30 hover:border-indigo-400/40 transition-all duration-300",
    text: "text-blue-400",
    buttonGradient: "from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600",
    terminalBg: "bg-[#040B14]/90",
    orbColors: ["96,165,250", "99,102,241"],
    animation: "animate-quantum",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.3)]",

    // ******* Monaco color codes *******
    monacoBackground: "#040B14",
    monacoForeground: "#a5b4fc", // pastel purple
    monacoComment: "#6b7280",    // gray-ish
    monacoKeyword: "#818cf8",    // indigo-400
    monacoString: "#c4b5fd",     // pastel lavender
  },
  starWars: {
    name: "Star Wars",
    primary: "from-yellow-400 via-amber-500 to-orange-600",
    secondary: "from-yellow-500 to-red-600",
    accent: "from-orange-400 to-amber-600",
    background: "bg-gradient-to-br from-[#000000] to-[#1a1a1a]",
    glass: "bg-[#1a1a1a]/10 backdrop-blur-xl border border-yellow-500/20",
    panel: "bg-[#000000]/20 backdrop-blur-xl border border-amber-400/30 hover:border-amber-400/40 transition-all duration-300",
    text: "text-yellow-400",
    buttonGradient: "from-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-600",
    terminalBg: "bg-[#000000]/90",
    orbColors: ["251,191,36", "245,158,11"],
    animation: "animate-starwars",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",

    // ******* Monaco color codes *******
    monacoBackground: "#000000",
    monacoForeground: "#fbbf24", // yellow
    monacoComment: "#a3a3a3",    // gray
    monacoKeyword: "#f87171",    // red-ish
    monacoString: "#fcd34d",     // gold
  },
  monochrome: {
    name: "Monochrome",
    primary: "from-gray-100 via-gray-300 to-gray-400",
    secondary: "from-gray-200 to-gray-500",
    accent: "from-white to-gray-300",
    background: "bg-gradient-to-br from-[#000000] to-[#121212]",
    glass: "bg-[#121212]/10 backdrop-blur-xl border border-gray-500/20",
    panel: "bg-[#000000]/20 backdrop-blur-xl border border-gray-400/30 hover:border-gray-400/40 transition-all duration-300",
    text: "text-gray-200",
    buttonGradient: "from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500",
    terminalBg: "bg-[#000000]/90",
    orbColors: ["229,231,235", "156,163,175"],
    animation: "animate-monochrome",
    glow: "shadow-[0_0_20px_rgba(229,231,235,0.3)]",

    monacoBackground: "#121212",
    monacoForeground: "#e5e7eb", 
    monacoComment: "#6b7280",    
    monacoKeyword: "#9ca3af",    
    monacoString: "#d1d5db",     
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Choose your default theme key here
  const [currentTheme, setCurrentTheme] = useState("quantum");

  const value = {
    theme: themes[currentTheme],
    setTheme: setCurrentTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
