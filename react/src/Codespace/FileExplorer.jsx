import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { FaFile, FaFolder, FaCode } from "react-icons/fa";

const FileExplorer = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [expandedFolders, setExpandedFolders] = useState(new Set(["src"]));
  
  // Get files from Redux state
  const files = useSelector(state => state.file.repositoryFiles);
  const currentFile = useSelector(state => state.file.currentFile);
  const loading = useSelector(state => state.file.loading);

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

  const handleFileClick = (file) => {
    if (file.type !== 'folder') {
      dispatch({ type: 'file/SET_FILE_LOADING', payload: true });
      
      // Fetch file content when a file is clicked
      fetch(`${API_BASE_URL}/files/${file._id}`)
        .then(res => res.json())
        .then(data => {
          dispatch({ type: 'file/SET_FILE', payload: data });
        })
        .catch(error => {
          dispatch({ type: 'file/SET_FILE_ERROR', payload: error.message });
        })
        .finally(() => {
          dispatch({ type: 'file/SET_FILE_LOADING', payload: false });
        });
    }
  };

  const renderFile = (file, level = 0) => {
    const isFolder = file.type === "folder";
    const isExpanded = expandedFolders.has(file.name);
    const isSelected = currentFile?._id === file._id;
    
    return (
      <div key={file.name}>
        <motion.div
          whileHover={{ 
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className={`flex items-center gap-2 py-2 px-3 cursor-pointer
            transition-all duration-200 group hover:shadow-lg hover:shadow-white/5
            ${isSelected ? 'bg-white/10' : ''}`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => isFolder ? toggleFolder(file.name) : handleFileClick(file)}
        >
          {/* Rest of the file/folder rendering code remains the same */}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-gray-400">Loading files...</span>
      </div>
    );
  }

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
          onClick={() => dispatch({ type: 'file/REFRESH_FILES' })}
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