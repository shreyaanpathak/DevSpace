import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import * as monaco from "monaco-editor";
import { FaCode } from "react-icons/fa";

const CodeEditor = ({ currentFile, onFileUpdate }) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    // Update theme when it changes
    useEffect(() => {
      if (!monacoRef.current) return;
  
      monaco.editor.defineTheme("custom-theme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: theme.monacoComment.replace("#", ""), fontStyle: "italic" },
          { token: "keyword", foreground: theme.monacoKeyword.replace("#", ""), fontStyle: "bold" },
          { token: "string", foreground: theme.monacoString.replace("#", "") },
          { token: "variable", foreground: theme.monacoForeground.replace("#", "") },
        ],
        colors: {
          "editor.foreground": theme.monacoForeground,
          "editor.background": theme.monacoBackground,
          "editor.selectionBackground": "#44475a",
          "editor.lineHighlightBackground": theme.monacoBackground,
          "editorCursor.foreground": theme.monacoForeground,
          "editor.inactiveSelectionBackground": "#6272a4",
          "editorWidget.background": theme.monacoBackground,
          "editorGutter.background": theme.monacoBackground,
          "minimap.background": theme.monacoBackground,
        },
      });
  
      monaco.editor.setTheme("custom-theme");
    }, [theme]);

    // Initialize editor and languages
    useEffect(() => {
      if (!editorRef.current) return;

      // Register CUDA language
      if (!monaco.languages.getLanguages().some(lang => lang.id === 'cuda')) {
        monaco.languages.register({ id: 'cuda' });
        monaco.languages.setMonarchTokensProvider('cuda', {
          defaultToken: '',
          keywords: [
            '__global__', '__device__', '__host__', '__shared__',
            'blockIdx', 'threadIdx', 'blockDim', 'gridDim'
          ],
          tokenizer: {
            root: [
              [/[a-zA-Z_]\w*/, {
                cases: {
                  '@keywords': 'keyword',
                  '@default': 'variable'
                }
              }],
              [/".*?"/, 'string'],
              [/\/\/.*/, 'comment'],
              [/[0-9]+/, 'number']
            ]
          }
        });
      }

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

        const editor = monaco.editor.create(editorRef.current, {
          value: currentFile.content || '',
          language: currentFile.language || 'plaintext',
          theme: 'custom-theme',
          automaticLayout: true,
          fontSize: 14,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          roundedSelection: true,
          padding: { top: 20 },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: true,
          cursorBlinking: 'smooth',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 14,
            horizontalScrollbarSize: 14,
            alwaysConsumeMouseWheel: false
          }
        });

        monacoRef.current = editor;

        const changeDisposable = editor.onDidChangeModelContent(() => {
          const content = editor.getValue();
          if (onFileUpdate && currentFile.id) {
            onFileUpdate(currentFile.id, content);
          }
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
    }, [currentFile, onFileUpdate]);

    const containerStyle = {
      backgroundColor: theme.monacoBackground,
      height: '100%',
      width: '100%',
    };

    return (
      <div className="flex flex-col h-full" style={containerStyle}>
        {/* Editor container */}
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
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5
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
