import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import Navbar from "../Navbar";
import * as monaco from "monaco-editor";
import { FaFile, FaFolder, FaUser, FaCode, FaTerminal, FaRobot, FaPlay, FaStop } from "react-icons/fa";

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

  export default AIAssistant;