import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import Navbar from "../Navbar";
import * as monaco from "monaco-editor";
import { FaFile, FaFolder, FaUser, FaCode, FaTerminal, FaRobot, FaPlay, FaStop } from "react-icons/fa";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import AIAssistant from "./AIAssistant";
import Collaborators from "./Collaborators";
import TerminalComponent from "./TerminalComponent";

const mockFiles = [
    { name: "src", type: "folder", children: [
      { name: "App.js", type: "file" },
      { name: "index.js", type: "file" }
    ]},
    { name: "package.json", type: "file" },
    { name: "README.md", type: "file" }
  ];

const mockCollaborators = [
  { id: 1, name: "John Doe", status: "active" },
  { id: 2, name: "Jane Smith", status: "idle" },
  { id: 3, name: "Bob Johnson", status: "offline" }
];


  const Codespace = () => {
    const { theme } = useTheme();
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen ${theme.background}`}
      >
        <Navbar />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pt-20 flex h-screen"
        >
          {/* Left Sidebar */}
          <motion.div 
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className={`w-64 flex flex-col ${theme.glass} border-r border-white/5 backdrop-blur-md`}
          >
            <div className="flex-1 p-4 overflow-y-auto">
              <FileExplorer files={mockFiles} />
            </div>
            
            <div className={`p-4 border-t border-white/5 ${theme.glass}`}>
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaUser className="text-gray-400" />
                </motion.div>
                <h2 className="text-gray-200 font-semibold">Collaborators</h2>
              </div>
              <Collaborators users={mockCollaborators} />
            </div>
          </motion.div>
  
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-[#1e1e1e] relative">
              <CodeEditor />
            </div>
  
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="h-1/3 flex border-t border-white/5 relative backdrop-blur-md"
            >
              <div className="flex-1 relative">
                <TerminalComponent />
              </div>
  
              <div className="w-80 border-l border-white/5 backdrop-blur-md">
                <AIAssistant />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  export default Codespace;