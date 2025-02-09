import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import {
  FaFile,
  FaFolder,
  FaCode,
  FaChevronRight,
  FaEllipsisH,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import { repositoriesApi } from "../api/repositories";
import { filesApi } from "../api/files";
import { actions } from "../redux/repositorySlice";
import { actions as fileActions } from "../redux/fileSlice";

const FileExplorer = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { repoId } = useParams();
  const [expandedFolders, setExpandedFolders] = useState(new Set(["src"]));
  const [expandedRepos, setExpandedRepos] = useState(new Set());
  const [uploadTrigger, setUploadTrigger] = useState(false);  // <--- NEW STATE


  const files = useSelector((state) => state.file.repositoryFiles);
  const currentRepository = useSelector(state => state.repository.currentRepository);
  const currentFile = useSelector((state) => state.file.currentFile);
  const repositories = useSelector(
    (state) => state.repository.accessibleRepositories
  );
  const loading = useSelector((state) => state.file.loading);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await repositoriesApi.getAccessibleRepositories();
        dispatch(actions.setAccessibleRepositories(repos));
      } catch (error) {
        console.error("Error loading repositories:", error);
      }
    };

    loadRepositories();
  }, [dispatch]);

  useEffect(() => {
    if (repoId) {
      const loadFiles = async () => {
        try {
          dispatch(fileActions.setFileLoading(true));
          const files = await filesApi.getFilesByRepository(repoId);
          dispatch(fileActions.setRepositoryFiles(files));
        } catch (error) {
          console.error("Error loading files:", error);
        } finally {
          dispatch(fileActions.setFileLoading(false));
        }
      };

      loadFiles();
    }
  }, [repoId, dispatch, uploadTrigger]);

  const handleFileClick = (file) => {
    if (file.type !== "folder") {
      dispatch(fileActions.setFileLoading(true));
      dispatch(fileActions.setFile(file));
      dispatch(fileActions.setFileLoading(false));
    } else {
      toggleFolder(file._id);
    }
  };

  const handleRepositoryClick = async (repository) => {
    try {
      dispatch(actions.setRepository(repository));

      const files = await filesApi.getFilesByRepository(repository.id);
      dispatch(fileActions.setRepositoryFiles(files));

      if (files.length > 0) {
        dispatch(fileActions.setFile(files[0]));
      }

      // Toggle repository expansion
      setExpandedRepos((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(repository._id)) {
          newSet.delete(repository._id);
        } else {
          newSet.add(repository._id);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error loading repository:", error);
      dispatch(actions.setRepositoryError(error.message));
    } finally {
      dispatch(actions.setRepositoryLoading(false));
    }
  };

  const handleFileUpload = async (e) => {
    e.stopPropagation();
    
    if (!currentRepository?.id) {
      console.error('Repository ID is missing');
      return;
    }
  
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    input.onchange = async (event) => {
      const files = Array.from(event.target.files);
      try {
        dispatch(fileActions.setFileLoading(true));
        
        const uploadPromises = files.map(async file => {
          const reader = new FileReader();
          
          const contentPromise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
          });
          
          reader.readAsText(file);
          const content = await contentPromise;
          
          const fileData = {
            filename: file.name,
            language: file.name.split('.').pop() || 'text',
            repositoryId: currentRepository.id,
            content: content,
            lastModified: new Date()
          };
          
          return filesApi.createFile(fileData);
        });
  
        await Promise.all(uploadPromises);
  
        setTimeout(async () => {
          const updatedFiles = await filesApi.getFilesByRepository(currentRepository.id);
          dispatch(fileActions.setRepositoryFiles(updatedFiles));
        }, 500);  
  
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        dispatch(fileActions.setFileLoading(false));
      }
    };
    
    input.click();
  };

  const handleFileDelete = async (e, file) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${file.filename}?`)) {
      try {
        dispatch(fileActions.setFileLoading(true));

        // Just use the ID string
        await filesApi.deleteFile(file._id);

        dispatch(
          fileActions.setRepositoryFiles(
            files.filter((f) => f._id !== file._id)
          )
        );

        if (currentFile?._id === file._id) {
          dispatch(fileActions.setFile(null));
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      } finally {
        dispatch(fileActions.setFileLoading(false));
      }
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderFileItem = (file, level = 0) => {
    const isFolder = file.type === "folder";
    const isExpanded = expandedFolders.has(file._id);
    const isActive = currentFile?._id === file._id;

    return (
      <div key={file._id}>
        <motion.div
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            scale: 1.01,
          }}
          className={`flex items-center gap-2 py-3 px-3 cursor-pointer
            rounded-lg transition-all duration-200 group
            ${isActive ? "bg-transparent" : ""}`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => handleFileClick(file)}
        >
          <div className="flex items-center gap-2 flex-1">
            {isFolder && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                <FaChevronRight className="text-xs" />
              </motion.div>
            )}
            {isFolder ? (
              <FaFolder
                className={`${
                  isExpanded ? "text-yellow-400" : "text-gray-400"
                }`}
              />
            ) : (
              <FaFile className="text-gray-400" />
            )}
            <span className="text-gray-300 text-sm">{file.filename}</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="hidden group-hover:flex items-center gap-2"
          >
            <button
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
              onClick={(e) => handleFileDelete(e, file)}
              title="Delete file"
            >
              <FaTrash className="text-gray-400 text-xs" />
            </button>
          </motion.div>
        </motion.div>

        {isFolder && file.children && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {file.children.map((child) => renderFileItem(child, level + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="text-gray-400 flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <FaCode className="text-lg" />
          </motion.div>
          Loading...
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header section remains the same */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <FaCode className="text-gray-400" />
          </motion.div>
          <span className="text-gray-200 font-medium">Explorer</span>
        </div>
      </div>

      <div className="space-y-4 p-2">
        {/* Repositories Section */}
        <div className="space-y-1">
          {repositories.map((repo) => (
            <div key={repo._id}>
              <motion.div
                onClick={() => handleRepositoryClick(repo)}
                whileHover={{
                  backgroundColor: `${theme.background}`,
                  scale: 1.01,
                }}
                className={`flex items-center gap-2 py-2 px-3 cursor-pointer
        rounded-lg transition-all duration-200 group
        ${repo._id === repoId ? "bg-white/10" : ""}`}
              >
                <motion.div
                  animate={{ rotate: expandedRepos.has(repo._id) ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <FaChevronRight className="text-xs" />
                </motion.div>
                <FaFolder
                  className={`${
                    repo._id === repoId ? "text-yellow-400" : "text-gray-400"
                  }`}
                />
                <span className="text-gray-300 text-sm flex-1">
                  {repo.repositoryName}
                </span>

                {repo._id === repoId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <button
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      onClick={(e) => handleFileUpload(e, repo._id)}
                      title="Upload files"
                    >
                      <FaUpload className="text-gray-400 text-xs" />
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {/* Files Section - Indented and animated */}
              <AnimatePresence>
                {expandedRepos.has(repo._id) &&
                  repo._id === repoId &&
                  files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6" // Add indentation
                    >
                      <div className="space-y-0.5">
                        {files.map((file) => renderFileItem(file))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
