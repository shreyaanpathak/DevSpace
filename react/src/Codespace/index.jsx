import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import Navbar from "../Navbar";
import * as monaco from "monaco-editor";
import { FaFile, FaFolder, FaUser, FaCode, FaTerminal, FaRobot, FaPlay, FaStop } from "react-icons/fa";
import CodeEditor from "./CodeEditor";


// Mock data
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

// Updated border styles
const borderStyles = {
    subtle: "border border-white/5",
    flush: "border border-white/8 backdrop-blur-md",
    glow: "border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]",
    accent: "border border-blue-500/20"
  };

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
  
  // AI Assistant Component with enhanced animations
  const AIAssistant = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([
      {
        type: 'info',
        content: 'Analyzing your code...',
        timestamp: new Date(),
      },
      {
        type: 'suggestion',
        content: 'Consider using torch.cuda.synchronize() after heavy computations for better performance.',
        timestamp: new Date(),
      },
      {
        type: 'warning',
        content: 'You might want to add error handling for CUDA out-of-memory issues.',
        timestamp: new Date(),
      }
    ]);
  
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full flex flex-col overflow-hidden"
      >
        <motion.div 
          className="flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-md"
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <FaRobot className="text-blue-400" />
            </motion.div>
            <span className="text-gray-200 font-medium">AI Assistant</span>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-xl"
            >
              <FaCode className="text-gray-400" />
            </motion.button>
          </div>
        </motion.div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 ${
                    message.type === 'info' ? 'bg-blue-500/5 border rounded-xl border-blue-500/10' :
                    message.type === 'warning' ? 'bg-yellow-500/5 border rounded-xl border-yellow-500/10' :
                    'bg-white/3 border rounded-xl border-white/5'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.type === 'info' && <FaCode className="text-blue-400 mt-1" />}
                    {message.type === 'warning' && <FaCode className="text-yellow-400 mt-1" />}
                    {message.type === 'suggestion' && <FaRobot className="text-purple-400 rounded-xl mt-1" />}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-gray-300 rounded-xl text-sm">{message.content}</p>
                    <span className="text-gray-500 text-xs mt-2 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
  
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-white/10 backdrop-blur-md"
        >
          <div className="flex gap-2">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Ask AI Assistant..."
              className={`flex-1 ${theme.panel} px-4 py-2 rounded-xl text-gray-300 
              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200`}
            style={{
              backgroundColor: theme.monacoBackground,
            }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 
                transition-all duration-200 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/20`}
            >
              Send
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const Collaborators = ({ users }) => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, x: 5 }}
            className="flex items-center gap-3 p-2 hover:bg-white/3 border border-transparent hover:border-white/5 transition-all duration-200"
          >
            <motion.div 
              animate={user.status === 'active' ? {
                scale: [1, 1.2, 1],
                transition: { repeat: Infinity, duration: 2 }
              } : {}}
              className={`w-2 h-2 rounded-full ${
                user.status === 'active' ? 'bg-green-500' :
                user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} 
            />
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <FaUser className="text-gray-400" />
            </motion.div>
            <span className="text-gray-300 text-sm">{user.name}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  };
  

  const TerminalComponent = () => {
    const { theme } = useTheme(); // Make sure you have this line
    const [commands, setCommands] = useState([
      { type: 'command', content: 'python main.py' },
      { type: 'output', content: 'Using device: cuda' },
      { type: 'output', content: 'Loading CUDA kernels...' },
      { type: 'success', content: 'Computation completed successfully!' }
    ]);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full overflow-hidden"
      >
        <motion.div 
          className="flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-md"
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                transition: { repeat: Infinity, duration: 5 }
              }}
            >
              <FaTerminal className="text-gray-400" />
            </motion.div>
            <span className={`${theme.text}`}>Terminal</span>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10"
            >
              <FaPlay className="text-green-400" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10"
            >
              <FaStop className="text-red-400" />
            </motion.button>
          </div>
        </motion.div>
        
        <div className={`flex-1 p-4 font-mono text-sm overflow-auto ${theme.background}`}>
          <AnimatePresence>
            {commands.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-2"
              >
                {cmd.type === 'command' && (
                  <div className="flex items-center gap-2">
                    <motion.span 
                      animate={{ 
                        color: ['#22c55e', '#15803d', '#22c55e']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-green-500"
                    >
                      $
                    </motion.span>
                    <span className={`${theme.text}`}>{cmd.content}</span>
                  </div>
                )}
                {cmd.type === 'output' && (
                  <div className={`ml-4 ${theme.text}`}>{cmd.content}</div>
                )}
                {cmd.type === 'success' && (
                  <div className="text-green-400 ml-4">{cmd.content}</div>
                )}
              </motion.div>
            ))}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-green-400">$</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`w-2 h-5 ${theme.text}`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

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