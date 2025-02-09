import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { filesApi } from '../api/files';
import { repositoriesApi } from '../api/repositories';
import Navbar from "../Navbar";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import AIAssistant from "./AIAssistant";
import Collaborators from "./Collaborators";
import TerminalComponent from "./TerminalComponent";
import { FaCode, FaUser } from "react-icons/fa";
import { UPDATE_FILE } from '../redux/fileSlice'; // Add this import

const Codespace = () => {
  const { repoId } = useParams();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const currentRepository = useSelector(state => state.repository.currentRepository);
  const files = useSelector(state => state.file.repositoryFiles);
  const currentFile = useSelector(state => state.file.currentFile);
  const collaborators = useSelector(state => state.repository.collaborators);
  const loading = useSelector(state => state.repository.loading);
  const [openFiles, setOpenFiles] = useState([]);

  useEffect(() => {
    if (repoId) {
      const loadData = async () => {
        dispatch({ type: 'file/SET_FILE_LOADING', payload: true });
        dispatch({ type: 'repository/SET_REPOSITORY_LOADING', payload: true });
    
        try {
          const repository = await repositoriesApi.getRepositoryById(repoId);
          
          const [filesData, collaboratorsData] = await Promise.all([
            filesApi.getFilesByRepository(repoId),
            repositoriesApi.getRepositoryCollaborators(repoId)
          ]);
    
          dispatch({ type: 'repository/SET_REPOSITORY', payload: repository });
          dispatch({ type: 'file/SET_REPOSITORY_FILES', payload: filesData });
          dispatch({ type: 'repository/SET_COLLABORATORS', payload: collaboratorsData });
    
          if (!currentFile && filesData.length > 0) {
            console.log('Setting initial file:', filesData[0]);
            dispatch({ type: 'file/SET_CURRENT_FILE', payload: filesData[0] });
            setOpenFiles([filesData[0]]);
          }
        } catch (error) {
          console.error('Error loading workspace:', error);
        } finally {
          dispatch({ type: 'file/SET_FILE_LOADING', payload: false });
          dispatch({ type: 'repository/SET_REPOSITORY_LOADING', payload: false });
        }
      };
    
      loadData();
    }
  }, [repoId, dispatch]);

  const handleFileUpdate = async (fileId, newContent) => {
    if (!fileId || !currentFile) {
        console.error('Missing required data for update:', { fileId, currentFile });
        return;
    }

    try {
        const updateData = {
            content: newContent,
            lastModified: new Date().toISOString()
        };
        
        const updatedFile = await filesApi.updateFile(fileId, updateData);
        
        // Ensure we're getting a fresh object from the server
        const refreshedFiles = await filesApi.getFilesByRepository(currentRepository.id);
        dispatch({ type: 'file/SET_REPOSITORY_FILES', payload: refreshedFiles });
        
        // Update current file if it's the one we just modified
        if (currentFile._id === fileId) {
            dispatch({ type: 'file/SET_CURRENT_FILE', payload: updatedFile });
        }
    } catch (error) {
        console.error('Failed to update file:', error);
    }
};

  const handleFileSelect = (file) => {
    if (!openFiles.find(f => f._id === file._id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    dispatch({ type: 'file/SET_CURRENT_FILE', payload: file });
  };

  const handleFileClose = (fileId) => {
    setOpenFiles(prev => prev.filter(f => f._id !== fileId));
    if (currentFile?._id === fileId) {
      const remainingFiles = openFiles.filter(f => f._id !== fileId);
      if (remainingFiles.length > 0) {
        dispatch({ type: 'file/SET_CURRENT_FILE', payload: remainingFiles[remainingFiles.length - 1] });
      } else {
        dispatch({ type: 'file/SET_CURRENT_FILE', payload: null });
      }
    }
  };
  
  const [activeCollaborators, setActiveCollaborators] = useState([]);

  const handleCollaboratorsChange = (collaborators) => {
    setActiveCollaborators(collaborators);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <div className="text-white flex items-center gap-3">
          <FaCode className="text-2xl text-blue-400" />
          Loading workspace...
        </div>
      </div>
    );
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
        transition={{ duration: 0.3 }}
        className="pt-20 flex h-screen"
      >
        <motion.div 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-64 flex flex-col ${theme.glass} border-r border-white/5 backdrop-blur-md`}
        >
          <div className="flex-1 p-4 overflow-y-auto">
            <FileExplorer onFileSelect={handleFileSelect} />
          </div>
          
          <div className={`p-4 border-t border-white/5 ${theme.glass}`}>
            <div className="flex items-center gap-2 mb-4">
              <FaUser className="text-gray-400" />
              <h2 className="text-gray-200 font-semibold">Collaborators</h2>
            </div>
            <Collaborators users={activeCollaborators} />
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col" key={currentRepository?.id}>
      <div className="flex-1 bg-[#1e1e1e] relative">
        <CodeEditor
          currentFile={currentFile}
          onFileUpdate={handleFileUpdate}
          openFiles={openFiles}
          onFileClose={handleFileClose}
          onFileSelect={handleFileSelect}
          onCollaboratorsChange={handleCollaboratorsChange}
        />
      </div>

          <motion.div 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
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
