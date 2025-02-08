import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const Codespace = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  // Replace mock data with Redux state
  const files = useSelector(state => state.file.repositoryFiles);
  const collaborators = useSelector(state => state.repository.collaborators);
  const loading = useSelector(state => state.repository.loading);
  
  // Fetch data when component mounts
  useEffect(() => {
    // Assuming we have the repoId from URL params or props
    const repoId = "currentRepoId"; // You'll need to get this from your routing
    dispatch({ type: 'file/SET_FILE_LOADING', payload: true });
    dispatch({ type: 'repository/SET_REPOSITORY_LOADING', payload: true });
    
    // Fetch files and collaborators
    fetch(`${API_BASE_URL}/repositories/${repoId}/files`)
      .then(res => res.json())
      .then(data => dispatch({ type: 'file/SET_REPOSITORY_FILES', payload: data }))
      .catch(error => dispatch({ type: 'file/SET_FILE_ERROR', payload: error.message }))
      .finally(() => dispatch({ type: 'file/SET_FILE_LOADING', payload: false }));

    fetch(`${API_BASE_URL}/repositories/${repoId}/collaborators`)
      .then(res => res.json())
      .then(data => dispatch({ type: 'repository/SET_COLLABORATORS', payload: data }))
      .catch(error => dispatch({ type: 'repository/SET_REPOSITORY_ERROR', payload: error.message }))
      .finally(() => dispatch({ type: 'repository/SET_REPOSITORY_LOADING', payload: false }));
  }, [dispatch]);

  if (loading) {
    return <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
      <div className="text-white">Loading...</div>
    </div>;
  }

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
            <FileExplorer files={files} />
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
            <Collaborators users={collaborators} />
          </div>
        </motion.div>

        {/* Rest of the component remains the same */}
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