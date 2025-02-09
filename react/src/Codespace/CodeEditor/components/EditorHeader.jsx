// CodeEditor/components/EditorHeader.jsx
import { FaRegSave, FaCircle, FaTimes } from "react-icons/fa";

const EditorHeader = ({ 
  currentFile, 
  openFiles, 
  unsavedFiles, 
  onSave, 
  onFileClose, 
  onFileSelect 
}) => {
  return (
    <>
      {/* Tabs Bar */}
      <div className="flex items-center overflow-x-auto bg-[#1e1e1e] border-b border-white/10">
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileSelect(file)}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-white/10
              ${currentFile?.id === file.id ? "bg-[#2d2d2d]" : "hover:bg-[#2d2d2d]"}`}
          >
            <span className="text-gray-300 text-sm whitespace-nowrap">
              {file.filename}
            </span>
            {unsavedFiles.has(file.id) && (
              <FaCircle className="text-white/50 text-[8px]" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileClose(file.id);
              }}
              className="hover:bg-white/10 p-1 rounded"
            >
              <FaTimes className="text-gray-400 text-xs" />
            </button>
          </div>
        ))}
      </div>

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">{currentFile?.filename}</span>
        </div>
        <button
          onClick={onSave}
          disabled={!currentFile || !unsavedFiles.has(currentFile.id)}
          className={`p-2 rounded-lg transition-colors ${
            currentFile && unsavedFiles.has(currentFile.id)
              ? "text-white hover:bg-white/10"
              : "text-gray-500 cursor-not-allowed"
          }`}
          title="Save (⌘S)"
        >
          <FaRegSave />
        </button>
      </div>
    </>
  );
};

export default EditorHeader;