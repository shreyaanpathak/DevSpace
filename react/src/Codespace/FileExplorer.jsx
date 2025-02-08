import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import Navbar from "../Navbar";
import * as monaco from "monaco-editor";
import { FaFile, FaFolder, FaUser, FaCode, FaTerminal, FaRobot, FaPlay, FaStop } from "react-icons/fa";




const FileExplorer = ({ files }) => {
    const { theme } = useTheme();
    const [expandedFolders, setExpandedFolders] = useState(new Set(["src"]));
  
    const toggleFolder = (folderName) => {
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(folderName)) {
          newSet.delete(folderName);
        } else {
          newSet.add(folderName);
        }
        return newSet;
      });
    };
  
    const renderFile = (file, level = 0) => {
      const isFolder = file.type === "folder";
      const isExpanded = expandedFolders.has(file.name);
      
      return (
        <div key={file.name}>
          <motion.div
            whileHover={{ 
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className={`flex items-center gap-2 py-2 px-3 cursor-pointer
              transition-all duration-200 group hover:shadow-lg hover:shadow-white/5`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => isFolder && toggleFolder(file.name)}
          >
            <div className="flex items-center gap-2 flex-1">
              {isFolder && (
                <motion.div
                  initial={false}
                  animate={{ 
                    rotate: isExpanded ? 90 : 0,
                    scale: isExpanded ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 text-xs"
                >
                  ▶
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {isFolder ? (
                  <FaFolder className={`${isExpanded ? 'text-yellow-400' : 'text-gray-400'}`} />
                ) : (
                  <FaFile className="text-gray-400" />
                )}
              </motion.div>
              <span className="text-gray-300 text-sm">{file.name}</span>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden group-hover:flex gap-2"
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                <FaCode className="text-gray-400 text-xs" />
              </motion.button>
            </motion.div>
          </motion.div>
          <AnimatePresence>
            {isFolder && isExpanded && file.children && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {file.children.map(child => renderFile(child, level + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };
  
    return (
      <div className="space-y-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FaCode className="text-gray-400" />
            </motion.div>
            <span className="text-gray-200 font-medium">Explorer</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <FaFolder className="text-gray-400" />
          </motion.button>
        </motion.div>
        <div className="py-2">
          {files.map(file => renderFile(file))}
        </div>
      </div>
    );
  };

  export default FileExplorer;