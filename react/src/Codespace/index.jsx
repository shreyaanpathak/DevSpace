// Codespace.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
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

const DEFAULT_FILES = [
  {
    id: 'default-1',
    name: 'main.py',
    language: 'python',
    content: `import torch\nimport numpy as np\n\ndef main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()`
  },
  {
    id: 'default-2',
    name: 'README.md',
    language: 'markdown',
    content: '# Project\n\nThis is a sample project.'
  }
];

const DEFAULT_COLLABORATORS = [
  { id: 1, name: 'John Doe', status: 'active' },
  { id: 2, name: 'Jane Smith', status: 'idle' }
];

const Codespace = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const files = useSelector(state => state.file.repositoryFiles);
  const currentFile = useSelector(state => state.file.currentFile);
  const collaborators = useSelector(state => state.repository.collaborators);
  const loading = useSelector(state => state.repository.loading);

  useEffect(() => {
    if (!repoId) {
      navigate('/devspaces');
      return;
    }
  
    const loadData = async () => {
      dispatch({ type: 'file/SET_FILE_LOADING', payload: true });
      dispatch({ type: 'repository/SET_REPOSITORY_LOADING', payload: true });
  
      try {
        console.log('Fetching data for repository:', repoId);
        
        // First, verify repository access
        const repository = await repositoriesApi.getRepositoryById(repoId);
        
        // Then fetch files and collaborators
        const [filesData, collaboratorsData] = await Promise.all([
          filesApi.getFilesByRepository(repoId),
          repositoriesApi.getRepositoryCollaborators(repoId)
        ]);
  
        console.log('Repository:', repository);
        console.log('Files data:', filesData);
        console.log('Collaborators data:', collaboratorsData);
  
        dispatch({ type: 'repository/SET_REPOSITORY', payload: repository });
        dispatch({ type: 'file/SET_REPOSITORY_FILES', payload: filesData });
        dispatch({ type: 'repository/SET_COLLABORATORS', payload: collaboratorsData });
  
        if (!currentFile && filesData.length > 0) {
          dispatch({ type: 'file/SET_CURRENT_FILE', payload: filesData[0] });
        }
      } catch (error) {
        console.error('Error loading workspace:', error);
        
        if (error.response?.status === 403) {
          navigate('/devspaces');
        } else if (error.response?.status === 404) {
          navigate('/devspaces');
        } else {
          dispatch({ type: 'file/SET_REPOSITORY_FILES', payload: DEFAULT_FILES });
          dispatch({ type: 'repository/SET_COLLABORATORS', payload: DEFAULT_COLLABORATORS });
        }
      } finally {
        dispatch({ type: 'file/SET_FILE_LOADING', payload: false });
        dispatch({ type: 'repository/SET_REPOSITORY_LOADING', payload: false });
      }
    };
  
    loadData();
  }, [repoId, dispatch, navigate, currentFile]);

  const handleFileUpdate = async (fileId, content) => {
    try {
      const updatedFile = await filesApi.updateFile(fileId, {
        content: content,
        filename: currentFile.filename,
        language: currentFile.language,
        repositoryId: repoId
      });
      dispatch({ type: 'file/UPDATE_FILE', payload: updatedFile });
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };
  
  const handleFileCreate = async (fileData) => {
    try {
      const newFile = await filesApi.uploadFile({
        ...fileData,
        repositoryId: repoId
      });
      dispatch({ type: 'file/ADD_FILE', payload: newFile });
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white flex items-center gap-3"
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
            <FaCode className="text-2xl text-blue-400" />
          </motion.div>
          Loading workspace...
        </motion.div>
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
        className="pt-20 flex h-screen"
      >
        <motion.div 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className={`w-64 flex flex-col ${theme.glass} border-r border-white/5 backdrop-blur-md`}
        >
          <div className="flex-1 p-4 overflow-y-auto">
            <FileExplorer 
              files={files}
              onFileCreate={handleFileCreate}
              currentFile={currentFile}
            />
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

        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#1e1e1e] relative">
            <CodeEditor
              currentFile={currentFile}
              onFileUpdate={handleFileUpdate}
            />
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
