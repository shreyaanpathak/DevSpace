import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { FaFile, FaFolder, FaCode } from "react-icons/fa";
import { repositoriesApi } from '../api/repositories'; // Add this import
import { actions } from '../redux/repositorySlice'; // Add this import
import { actions as fileActions } from '../redux/fileSlice'; // Add this import

const FileExplorer = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState(new Set(["src"]));
  
  const files = useSelector(state => state.file.repositoryFiles);
  const currentFile = useSelector(state => state.file.currentFile);
  const repositories = useSelector(state => state.repository.accessibleRepositories);
  const loading = useSelector(state => state.file.loading);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await repositoriesApi.getAccessibleRepositories();
        dispatch(actions.setAccessibleRepositories(repos));
      } catch (error) {
        console.error('Error loading repositories:', error);
      }
    };

    loadRepositories();
  }, [dispatch]);

  const handleFileClick = (file) => {
    if (file.type !== 'folder') {
      dispatch(fileActions.setFileLoading(true));
      dispatch(fileActions.setFile(file));
      dispatch(fileActions.setFileLoading(false));
    }
  };

  const handleRepositoryClick = (repository) => {
    navigate(`/devspaces/${repository._id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-gray-400">Loading files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Repositories Section */}
      <div className="mb-4">
        <h2 className="text-gray-200 font-semibold mb-2 px-3">Repositories</h2>
        {repositories.map(repo => (
          <motion.div
            key={repo._id}
            onClick={() => handleRepositoryClick(repo)}
            whileHover={{ 
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              scale: 1.02,
            }}
            className={`flex items-center gap-2 py-2 px-3 cursor-pointer
              transition-all duration-200 ${repo._id === repoId ? 'bg-white/10' : ''}`}
          >
            <FaFolder className="text-gray-400" />
            <span className="text-gray-300 text-sm">{repo.repositoryName}</span>
          </motion.div>
        ))}
      </div>

      {/* Files Section */}
      {files.length > 0 && (
        <div>
          <h2 className="text-gray-200 font-semibold mb-2 px-3">Files</h2>
          {files.map(file => (
            <motion.div
              key={file._id}
              onClick={() => handleFileClick(file)}
              whileHover={{ 
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                scale: 1.02,
              }}
              className={`flex items-center gap-2 py-2 px-3 cursor-pointer
                transition-all duration-200 ${currentFile?._id === file._id ? 'bg-white/10' : ''}`}
            >
              <FaFile className="text-gray-400" />
              <span className="text-gray-300 text-sm">{file.filename}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
