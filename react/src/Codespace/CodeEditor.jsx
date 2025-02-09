import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import * as monaco from "monaco-editor";
import { FaCode, FaRegSave, FaCircle, FaTimes } from "react-icons/fa";

const CodeEditor = ({
  currentFile,
  onFileUpdate,
  openFiles,
  onFileClose,
  onFileSelect,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());

  const handleSave = () => {
    if (currentFile && currentFile.id) {
        const content = monacoRef.current.getValue();
        // Just pass the ID as is, no need to check for $oid
        onFileUpdate(currentFile.id, content);
    }
};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (currentFile) {
          handleSave(currentFile.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentFile]);

  const defineCustomTheme = () => {
    const syntaxColors = {
      // Main colors from theme
      base: theme.monacoForeground,
      keywords: theme.monacoKeyword,
      strings: theme.monacoString,
      comments: theme.monacoComment,
      background: theme.monacoBackground,

      // Additional colors for better contrast
      functions: "#61AFEF", // Bright blue
      types: "#E5C07B", // Soft yellow
      numbers: "#D19A66", // Soft orange
      operators: "#56B6C2", // Cyan
      variables: "#ABB2BF", // Light gray
      constants: "#C678DD", // Purple
      parameters: "#98C379", // Green
      decorators: "#E06C75", // Soft red
    };

    monaco.editor.defineTheme("custom-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        // Base syntax
        {
          token: "comment",
          foreground: syntaxColors.comments.replace("#", ""),
          fontStyle: "italic",
        },
        {
          token: "keyword",
          foreground: syntaxColors.keywords.replace("#", ""),
          fontStyle: "bold",
        },
        { token: "string", foreground: syntaxColors.strings.replace("#", "") },
        {
          token: "identifier",
          foreground: syntaxColors.variables.replace("#", ""),
        },
        {
          token: "variable",
          foreground: syntaxColors.variables.replace("#", ""),
        },

        // Enhanced syntax elements
        {
          token: "type",
          foreground: syntaxColors.types.replace("#", ""),
          fontStyle: "bold",
        },
        { token: "number", foreground: syntaxColors.numbers.replace("#", "") },
        {
          token: "operator",
          foreground: syntaxColors.operators.replace("#", ""),
        },
        {
          token: "function",
          foreground: syntaxColors.functions.replace("#", ""),
        },
        {
          token: "parameter",
          foreground: syntaxColors.parameters.replace("#", ""),
        },
        {
          token: "class",
          foreground: syntaxColors.types.replace("#", ""),
          fontStyle: "bold",
        },
        {
          token: "interface",
          foreground: syntaxColors.types.replace("#", ""),
          fontStyle: "italic",
        },
        { token: "enum", foreground: syntaxColors.types.replace("#", "") },
        {
          token: "decorator",
          foreground: syntaxColors.decorators.replace("#", ""),
        },
        {
          token: "constant",
          foreground: syntaxColors.constants.replace("#", ""),
        },

        // Language-specific elements
        {
          token: "delimiter",
          foreground: syntaxColors.operators.replace("#", ""),
        },
        { token: "tag", foreground: syntaxColors.keywords.replace("#", "") },
        {
          token: "metatag",
          foreground: syntaxColors.decorators.replace("#", ""),
        },
        {
          token: "annotation",
          foreground: syntaxColors.decorators.replace("#", ""),
        },
        {
          token: "control",
          foreground: syntaxColors.keywords.replace("#", ""),
        },
        {
          token: "directive",
          foreground: syntaxColors.decorators.replace("#", ""),
        },
        { token: "unit", foreground: syntaxColors.numbers.replace("#", "") },
        {
          token: "modifier",
          foreground: syntaxColors.keywords.replace("#", ""),
        },
        {
          token: "punctuation",
          foreground: syntaxColors.operators.replace("#", ""),
        },
      ],
      colors: {
        // Editor UI
        "editor.foreground": syntaxColors.base,
        "editor.background": syntaxColors.background,
        "editor.selectionBackground": "#264F78",
        "editor.lineHighlightBackground": `${syntaxColors.base}15`,
        "editor.lineHighlightBorder": `${syntaxColors.base}00`,

        // Cursor and selection
        "editorCursor.foreground": syntaxColors.base,
        "editor.selectionHighlightBackground": "#264F7855",
        "editor.inactiveSelectionBackground": "#264F7844",
        "editor.wordHighlightBackground": "#264F7844",
        "editor.wordHighlightStrongBackground": "#264F7866",

        // Editor widgets
        "editorWidget.background": syntaxColors.background,
        "editorWidget.border": `${syntaxColors.base}33`,
        "editorSuggestWidget.background": syntaxColors.background,
        "editorSuggestWidget.border": `${syntaxColors.base}33`,
        "editorSuggestWidget.foreground": syntaxColors.base,
        "editorSuggestWidget.selectedBackground": "#264F7844",

        // Gutter and minimap
        "editorGutter.background": syntaxColors.background,
        "editorGutter.modifiedBackground": syntaxColors.functions,
        "editorGutter.addedBackground": syntaxColors.parameters,
        "editorGutter.deletedBackground": syntaxColors.decorators,
        "minimap.background": syntaxColors.background,

        // Scrollbar
        "scrollbarSlider.background": `${syntaxColors.base}22`,
        "scrollbarSlider.hoverBackground": `${syntaxColors.base}44`,
        "scrollbarSlider.activeBackground": `${syntaxColors.base}88`,

        // Other UI elements
        "editorIndentGuide.background": `${syntaxColors.base}15`,
        "editorIndentGuide.activeBackground": `${syntaxColors.base}33`,
        "editorLineNumber.foreground": `${syntaxColors.base}44`,
        "editorLineNumber.activeForeground": syntaxColors.base,
        "editorBracketMatch.background": `${syntaxColors.base}33`,
        "editorBracketMatch.border": syntaxColors.operators,
      },
    });
    monaco.editor.setTheme("custom-theme");
  };

  // Apply theme when it changes
  useEffect(() => {
    defineCustomTheme();
  }, [theme]);

  // Language support configuration
  useEffect(() => {
    // CUDA Language Support
    if (!monaco.languages.getLanguages().some((lang) => lang.id === "cuda")) {
      monaco.languages.register({ id: "cuda" });
      monaco.languages.setMonarchTokensProvider("cuda", {
        defaultToken: "variable",
        keywords: [
          "__global__",
          "__device__",
          "__host__",
          "__shared__",
          "__constant__",
          "blockIdx",
          "threadIdx",
          "blockDim",
          "gridDim",
          "warpSize",
          "if",
          "else",
          "for",
          "while",
          "do",
          "switch",
          "case",
          "break",
          "continue",
          "return",
          "void",
          "int",
          "float",
          "double",
          "char",
          "unsigned",
          "signed",
          "struct",
          "union",
          "enum",
          "sizeof",
          "dim3",
          "uint3",
          "int3",
          "float3",
          "double3",
        ],
        typeKeywords: [
          "texture",
          "surface",
          "cudaError_t",
          "cudaEvent_t",
          "cudaStream_t",
          "size_t",
          "ptrdiff_t",
          "clock_t",
          "void",
          "bool",
          "char",
          "short",
          "int",
          "long",
          "float",
          "double",
          "unsigned",
        ],
        operators: [
          "=",
          ">",
          "<",
          "!",
          "~",
          "?",
          ":",
          "==",
          "<=",
          ">=",
          "!=",
          "&&",
          "||",
          "++",
          "--",
          "+",
          "-",
          "*",
          "/",
          "&",
          "|",
          "^",
          "%",
          "<<",
          ">>",
          ">>>",
          "+=",
          "-=",
          "*=",
          "/=",
          "&=",
          "|=",
          "^=",
          "%=",
          "<<=",
          ">>=",
          ">>>=",
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes:
          /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
          root: [
            [
              /[a-zA-Z_]\w*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@typeKeywords": "type",
                  "@default": "variable",
                },
              },
            ],
            [/\b[0-9]+\b/, "number"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "delimiter",
                },
              },
            ],
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
          comment: [
            [/[^\/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"],
          ],
        },
      });
    }

    // Python Language Enhancements
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: "def",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "def ${1:name}(${2:params}):\n\t${0}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "class",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "class ${1:name}:\n\tdef __init__(self):\n\t\t${0}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
        ];
        return { suggestions };
      },
    });

    // C Language Support
    monaco.languages.setMonarchTokensProvider("c", {
      defaultToken: "variable",
      keywords: [
        "break",
        "case",
        "continue",
        "default",
        "do",
        "else",
        "enum",
        "for",
        "goto",
        "if",
        "return",
        "sizeof",
        "struct",
        "switch",
        "typedef",
        "union",
        "volatile",
        "while",
        "#include",
        "#define",
        "#ifndef",
        "#endif",
        "NULL",
        "const",
        "static",
        "extern",
      ],
      typeKeywords: [
        "void",
        "char",
        "short",
        "int",
        "long",
        "float",
        "double",
        "signed",
        "unsigned",
        "bool",
        "size_t",
      ],
      operators: [
        "=",
        ">",
        "<",
        "!",
        "~",
        "?",
        ":",
        "==",
        "<=",
        ">=",
        "!=",
        "&&",
        "||",
        "++",
        "--",
        "+",
        "-",
        "*",
        "/",
        "&",
        "|",
        "^",
        "%",
        "<<",
        ">>",
        ">>>",
        "+=",
        "-=",
        "*=",
        "/=",
        "&=",
        "|=",
        "^=",
        "%=",
        "<<=",
        ">>=",
        ">>>=",
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,

      tokenizer: {
        root: [
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                "@keywords": "keyword",
                "@typeKeywords": "type",
                "@default": "variable",
              },
            },
          ],
          [/\b[0-9]+\b/, "number"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          [/\/\/.*$/, "comment"],
          [/\/\*/, "comment", "@comment"],
          [
            /@symbols/,
            {
              cases: {
                "@operators": "operator",
                "@default": "delimiter",
              },
            },
          ],
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
        ],
        comment: [
          [/[^\/*]+/, "comment"],
          [/\/\*/, "comment", "@push"],
          [/\*\//, "comment", "@pop"],
          [/[\/*]/, "comment"],
        ],
      },
    });

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, []);
  // Handle editor creation and updates
  useEffect(() => {
    if (!editorRef.current || !currentFile) return;

    const initEditor = async () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }

      defineCustomTheme();

      const editor = monaco.editor.create(editorRef.current, {
        value: currentFile.content || "",
        language: currentFile.language || "plaintext",
        theme: "custom-theme",
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        roundedSelection: true,
        padding: { top: 20 },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: true,
        cursorBlinking: "smooth",
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: true,
        folding: true,
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
          verticalScrollbarSize: 14,
          horizontalScrollbarSize: 14,
          alwaysConsumeMouseWheel: false,
        },
        suggest: {
          snippetsPreventQuickSuggestions: false,
          showWords: true,
          showVariables: true,
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          showFiles: true,
          showFields: true,
          showClasses: true,
        },
      });

      monacoRef.current = editor;

      const changeDisposable = editor.onDidChangeModelContent(() => {
        setUnsavedFiles((prev) => new Set(prev).add(currentFile.id));
      });

      const resizeObserver = new ResizeObserver(() => {
        if (monacoRef.current) {
          monacoRef.current.layout();
        }
      });

      if (editorRef.current) {
        resizeObserver.observe(editorRef.current);
      }
      setIsLoading(false);

      return () => {
        changeDisposable.dispose();
        resizeObserver.disconnect();
      };
    };

    const timer = setTimeout(initEditor, 100);
    return () => clearTimeout(timer);
  }, [currentFile, theme]);

  useEffect(() => {
    setUnsavedFiles(new Set());
  }, []);

  const containerStyle = {
    backgroundColor: theme.monacoBackground,
    height: "100%",
    width: "100%",
  };

  return (
    <div className="flex flex-col h-full" style={containerStyle}>
      {/* Tabs Bar */}
      <div className="flex items-center overflow-x-auto bg-[#1e1e1e] border-b border-white/10">
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileSelect(file)}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-white/10
              ${
                currentFile?.id === file.id
                  ? "bg-[#2d2d2d]"
                  : "hover:bg-[#2d2d2d]"
              }`}
          >
            <span className="text-gray-300 text-sm whitespace-nowrap">
              {file.filename}
            </span>
            {unsavedFiles.has(file.id) && (
              <FaCircle className="text-white/50 text-[8px]" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileClose(file.id);
              }}
              className="hover:bg-white/10 p-1 rounded"
            >
              <FaTimes className="text-gray-400 text-xs" />
            </button>
          </div>
        ))}
      </div>

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">{currentFile?.filename}</span>
        </div>
        <button
          onClick={() => currentFile && handleSave(currentFile.id)}
          disabled={!currentFile || !unsavedFiles.has(currentFile.id)}
          className={`p-2 rounded-lg transition-colors ${
            currentFile && unsavedFiles.has(currentFile.id)
              ? "text-white hover:bg-white/10"
              : "text-gray-500 cursor-not-allowed"
          }`}
          title="Save (⌘S)"
        >
          <FaRegSave />
        </button>
      </div>

      {/* Editor Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex-1"
        style={containerStyle}
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={containerStyle}
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            >
              <FaCode className={`text-4xl ${theme.text}`} />
            </motion.div>
          </motion.div>
        )}
        <div ref={editorRef} className="h-full w-full" />
      </motion.div>
    </div>
  );
};

export default CodeEditor;
