import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import Navbar from "../Navbar";
import * as monaco from "monaco-editor";
import { FaFile, FaFolder, FaUser, FaCode, FaTerminal, FaRobot, FaPlay, FaStop } from "react-icons/fa";

const CodeEditor = () => {
    const editorRef = useRef(null);
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [activeFile, setActiveFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([
      {
        name: 'main.py',
        language: 'python',
        content: `import torch
  import numpy as np
  
  def main():
      device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
      print(f"Using device: {device}")
      
  if __name__ == "__main__":
      main()`
      },
      {
        name: 'kernel.cu',
        language: 'cuda',
        content: `__global__ void vectorAdd(float *a, float *b, float *c, int n) {
      int i = blockDim.x * blockIdx.x + threadIdx.x;
      if (i < n) {
          c[i] = a[i] + b[i];
      }
  }`
      },
      {
        name: 'utils.cpp',
        language: 'cpp',
        content: `#include <iostream>
  
  void processData(float* data, size_t size) {
      for(size_t i = 0; i < size; ++i) {
          data[i] *= 2.0f;
      }
  }`
      }
    ]);
    const [editor, setEditor] = useState(null);
  
    const handleFileClose = (fileToClose) => {
      const newFiles = openFiles.filter(f => f.name !== fileToClose.name);
      setOpenFiles(newFiles);
  
      if (activeFile?.name === fileToClose.name) {
        if (newFiles.length > 0) {
          setActiveFile(newFiles[0]);
        } else {
          setActiveFile(null);
        }
      }
    };
  
    // Update theme when it changes
    useEffect(() => {
      if (!editor) return;
  
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
    }, [theme, editor]);
  
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
  
      // Set initial active file
      if (!activeFile && openFiles.length > 0) {
        setActiveFile(openFiles[0]);
      }
  
      // Create editor instance
      const editorInstance = monaco.editor.create(editorRef.current, {
        value: activeFile?.content || '',
        language: activeFile?.language || 'plaintext',
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
        backgroundColor: theme.monacoBackground,
      });
  
      setEditor(editorInstance);
      setIsLoading(false);
  
      return () => {
        editorInstance.dispose();
      };
    }, []);
  
    // Update editor content when active file changes
    useEffect(() => {
      if (editor && activeFile) {
        editor.setValue(activeFile.content);
        monaco.editor.setModelLanguage(editor.getModel(), activeFile.language);
      }
    }, [activeFile, editor]);
  
    const containerStyle = {
      backgroundColor: theme.monacoBackground,
      height: '100%',
      width: '100%',
    };
  
    const FileTab = ({ file, isActive, onClick, onClose }) => {
      return (
        <motion.div
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-white/5
            ${isActive ? 'bg-white/10' : 'bg-transparent'}`}
          onClick={onClick}
        >
          <div className="flex items-center gap-2">
            {file.language === 'python' && <FaCode className="text-blue-400 text-sm" />}
            {file.language === 'cpp' && <FaCode className="text-green-400 text-sm" />}
            {file.language === 'cuda' && <FaCode className="text-yellow-400 text-sm" />}
            <span className="text-gray-300 text-sm">{file.name}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 text-gray-500 hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onClose(file);
            }}
          >
            ×
          </motion.button>
        </motion.div>
      );
    };
  
    return (
      <div className="flex flex-col h-full" style={containerStyle}>
        {/* File tabs */}
        <motion.div 
          className={`flex border-b border-white/5 overflow-x-auto`}
          style={{ backgroundColor: theme.monacoBackground }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {openFiles.map(file => (
            <FileTab
              key={file.name}
              file={file}
              isActive={activeFile?.name === file.name}
              onClick={() => setActiveFile(file)}
              onClose={handleFileClose}
            />
          ))}
        </motion.div>
        
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