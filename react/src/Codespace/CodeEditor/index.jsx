import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Home/ThemeContext";
import * as monaco from "monaco-editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

import EditorHeader from "./components/EditorHeader";
import LoadingIndicator from "./components/LoadingIndicator";
import { useSelector } from "react-redux";

const CodeEditor = ({
  currentFile,
  onFileUpdate,
  openFiles,
  onFileClose,
  onFileSelect,
  onCollaboratorsChange,
}) => {
  const editorRef = useRef(null);
  const monacoEditorRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  // We'll store the remote-cursor "decorations" so we can remove & add them
  // when awareness changes.
  const cursorDecorationsRef = useRef([]);

  const currentUser = useSelector((state) => state.account.currentUser);

  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());

  // Handle manual "save" (Ctrl/Cmd + S) if needed
  const handleSave = () => {
    if (currentFile?.id && monacoEditorRef.current) {
      const content = monacoEditorRef.current.getValue();
      onFileUpdate(currentFile.id, content);
      setUnsavedFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentFile.id);
        return newSet;
      });
    }
  };

  // Listen for Ctrl/Cmd + S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (currentFile) {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentFile]);

  // Dynamically set a custom Monaco theme (optional)
  useEffect(() => {
    const syntaxColors = {
      base: theme.monacoForeground,
      keywords: theme.monacoKeyword,
      strings: theme.monacoString,
      comments: theme.monacoComment,
      background: theme.monacoBackground,
      functions: "#61AFEF",
      types: "#E5C07B",
      numbers: "#D19A66",
      operators: "#56B6C2",
      variables: "#ABB2BF",
      constants: "#C678DD",
      parameters: "#98C379",
      decorators: "#E06C75",
    };

    monaco.editor.defineTheme("custom-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
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
        {
          token: "string",
          foreground: syntaxColors.strings.replace("#", ""),
        },
        {
          token: "identifier",
          foreground: syntaxColors.variables.replace("#", ""),
        },
        {
          token: "variable",
          foreground: syntaxColors.variables.replace("#", ""),
        },
        {
          token: "type",
          foreground: syntaxColors.types.replace("#", ""),
          fontStyle: "bold",
        },
        {
          token: "number",
          foreground: syntaxColors.numbers.replace("#", ""),
        },
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
        {
          token: "enum",
          foreground: syntaxColors.types.replace("#", ""),
        },
        {
          token: "decorator",
          foreground: syntaxColors.decorators.replace("#", ""),
        },
        {
          token: "constant",
          foreground: syntaxColors.constants.replace("#", ""),
        },
      ],
      colors: {
        "editor.foreground": syntaxColors.base,
        "editor.background": syntaxColors.background,
        "editor.selectionBackground": "#264F78",
        "editor.lineHighlightBackground": `${syntaxColors.base}15`,
        "editor.lineHighlightBorder": `${syntaxColors.base}00`,
        "editorCursor.foreground": syntaxColors.base,
        "editor.selectionHighlightBackground": "#264F7855",
        "editor.inactiveSelectionBackground": "#264F7844",
        "editor.wordHighlightBackground": "#264F7844",
        "editor.wordHighlightStrongBackground": "#264F7866",
        "editorWidget.background": syntaxColors.background,
        "editorWidget.border": `${syntaxColors.base}33`,
        "editorSuggestWidget.background": syntaxColors.background,
        "editorSuggestWidget.border": `${syntaxColors.base}33`,
        "editorSuggestWidget.foreground": syntaxColors.base,
        "editorSuggestWidget.selectedBackground": "#264F7844",
        "editorGutter.background": syntaxColors.background,
        "scrollbarSlider.background": `${syntaxColors.base}22`,
        "scrollbarSlider.hoverBackground": `${syntaxColors.base}44`,
        "scrollbarSlider.activeBackground": `${syntaxColors.base}88`,
      },
    });

    monaco.editor.setTheme("custom-theme");
  }, [theme]);

  // Main effect to set up YJS, WebSocket, Monaco, and cursor logic
  useEffect(() => {
    if (!editorRef.current || !currentFile) return;

    let editorInstance = null;

    // Cleanup old references if switching files
    if (monacoEditorRef.current) {
      monacoEditorRef.current.dispose();
    }
    bindingRef.current?.destroy();
    providerRef.current?.destroy();
    ydocRef.current?.destroy();

    // Create a new Y.Doc
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Create a new WebSocket provider (Y-WebSocket)
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      `codespace-${currentFile.id}`,
      ydoc
    );
    providerRef.current = provider;

    // Create the shared Y.Text
    const ytext = ydoc.getText("monaco");

    provider.on('sync', (isSynced) => {
      // Only initialize content if we're synced and the document is empty
      if (isSynced && ytext.length === 0 && currentFile.content) {
        ytext.insert(0, currentFile.content);
      }
    });


    // Create the Monaco editor
    editorInstance = monaco.editor.create(editorRef.current, {
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
    });
    monacoEditorRef.current = editorInstance;

    // Link Y.Text <-> Monaco model
    const binding = new MonacoBinding(
      ytext,
      editorInstance.getModel(),
      new Set([editorInstance]),
      provider.awareness
    );
    bindingRef.current = binding;

    // Initialize local awareness state
    provider.awareness.setLocalState({
      name: currentUser?.username || "Anonymous",
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      // We'll store the current local selection/cursor here too:
      cursor: null,
    });

    // === 1) Listen for local selection changes & update "cursor" in awareness ===
    const handleSelectionChange = () => {
      const selection = editorInstance.getSelection();
      if (!selection) return;

      provider.awareness.setLocalStateField("cursor", {
        start: {
          lineNumber: selection.startLineNumber,
          column: selection.startColumn,
        },
        end: {
          lineNumber: selection.endLineNumber,
          column: selection.endColumn,
        },
      });
    };
    // Fire whenever our local cursor/selection changes
    const selectionListener = editorInstance.onDidChangeCursorSelection(
      handleSelectionChange
    );

    // === 2) Listen for ANY awareness change (other users join, leave, move) ===
    const onAwarenessChange = () => {
      // Update the "Collaborators" sidebar
      const states = Array.from(provider.awareness.getStates().values());
      onCollaboratorsChange(states);

      // Build a new set of Monaco decorations for all remote cursors
      const allStates = Array.from(provider.awareness.getStates().entries());
      const newDecorations = [];

      for (const [clientID, state] of allStates) {
        // Skip ourselves
        if (clientID === provider.awareness.clientID) continue;

        const { name, color, cursor } = state;
        if (!cursor || !cursor.start || !cursor.end) continue;

        const range = new monaco.Range(
          cursor.start.lineNumber,
          cursor.start.column,
          cursor.end.lineNumber,
          cursor.end.column
        );

        // Option A: Use hoverMessage as a simple name tooltip
        newDecorations.push({
          range,
          options: {
            className: "remoteSelection", // highlight
            hoverMessage: { value: `**${name}**` }, // shows on hover
            // -------------------------------------------------------------------
            // Option B (Optional): Show a floating label with the user's name
            // afterContentClassName: `remoteSelectionLabel`, // see CSS for styling
          },
        });
      }

      // Replace old decorations with new
      cursorDecorationsRef.current = editorInstance.deltaDecorations(
        cursorDecorationsRef.current,
        newDecorations
      );
    };
    provider.awareness.on("change", onAwarenessChange);

    // === 3) Listen for content changes => Mark file as unsaved ===
    const onContentChange = () => {
      setUnsavedFiles((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentFile.id);
        return newSet;
      });
    };
    const disposable = editorInstance.onDidChangeModelContent(onContentChange);

    // Monitor YJS connection status
    provider.on("status", (event) => {
      console.log("YJS Connection status:", event.status);
    });

    setIsLoading(false);

    // Cleanup on unmount or file change
    return () => {
      selectionListener.dispose();
      disposable.dispose();
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
      editorInstance.dispose();
      provider.awareness.off("change", onAwarenessChange);
    };
  }, [currentFile]);

  // Just some styling for the editor container
  const containerStyle = {
    backgroundColor: theme.monacoBackground,
    height: "100%",
    width: "100%",
  };

  return (
    <div className="flex flex-col h-full" style={containerStyle}>
      <EditorHeader
        currentFile={currentFile}
        openFiles={openFiles}
        unsavedFiles={unsavedFiles}
        onSave={handleSave}
        onFileClose={onFileClose}
        onFileSelect={onFileSelect}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex-1"
        style={containerStyle}
      >
        {isLoading && <LoadingIndicator theme={theme} />}
        <div ref={editorRef} className="h-full w-full" />
      </motion.div>
    </div>
  );
};

export default CodeEditor;
