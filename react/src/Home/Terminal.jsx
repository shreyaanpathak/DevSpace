import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { useTheme } from "./ThemeContext";

const Terminal = () => {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;

    monaco.editor.defineTheme("custom-theme", {
      base: theme.name === "Monochrome" ? "vs" : "vs-dark",
      inherit: true,
      rules: [
        {
          token: "comment",
          foreground: theme.monacoComment || "888888",
          fontStyle: "italic",
        },
        {
          token: "keyword",
          foreground: theme.monacoKeyword || "ff007f",
          fontStyle: "bold",
        },
        {
          token: "string",
          foreground: theme.monacoString || "00ff00",
        },
        {
          token: "number",
          foreground: "FFD700", // Gold for numbers
        },
        {
          token: "variable",
          foreground: theme.monacoForeground || "ffffff",
        },
      ],
      colors: {
        "editor.foreground": theme.monacoForeground || "#ffffff",
        "editor.background": theme.monacoBackground || "#1e1e1e",
        "editorCursor.foreground": "#ffcc00",
        "editor.lineHighlightBackground": "#2a2a2a",
        "editor.selectionBackground": "#44475a",
        "editor.inactiveSelectionBackground": "#6272a4",
      },
    });

    // Create the Monaco editor
    const editor = monaco.editor.create(editorRef.current, {
      value: `# GPU Setup Script
mkdir my-project && cd my-project

git init

conda create --name cuda-env python=3.8
conda activate cuda-env

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

echo "Environment setup complete!"
`,
      language: "bash",
      theme: "custom-theme", // Apply our defined theme
      readOnly: true,
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      wordWrap: "on",
    });

    return () => {
      editor.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={editorRef}
      className="h-64 w-full rounded-lg shadow-lg"
    />
  );
};

export default Terminal;
