import { filesApi } from "../api/files";

// Action Types - keep for compatibility
export const SET_FILE = "file/SET_FILE";
export const SET_REPOSITORY_FILES = "file/SET_REPOSITORY_FILES";
export const SET_FILE_LOADING = "file/SET_FILE_LOADING";
export const SET_FILE_ERROR = "file/SET_FILE_ERROR";
export const UPDATE_FILE = "file/UPDATE_FILE";
export const ADD_FILE = "file/ADD_FILE";

const initialState = {
  currentFile: null,
  repositoryFiles: [],
  loading: false,
  error: null,
};

// Action Creators
export const actions = {
  setFile: (payload) => ({ type: SET_FILE, payload }),
  setRepositoryFiles: (payload) => ({ type: SET_REPOSITORY_FILES, payload }),
  setFileLoading: (payload) => ({ type: SET_FILE_LOADING, payload }),
  setFileError: (payload) => ({ type: SET_FILE_ERROR, payload }),
  updateFile: (payload) => ({ type: UPDATE_FILE, payload }),
  addFile: (payload) => ({ type: ADD_FILE, payload }),
};

// Reducer
export default function fileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILE:
      return {
        ...state,
        currentFile: action.payload,
        error: null,
      };
    case SET_REPOSITORY_FILES:
      return {
        ...state,
        repositoryFiles: action.payload,
        error: null,
      };
    case SET_FILE_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_FILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case UPDATE_FILE:
      return {
        ...state,
        repositoryFiles: state.repositoryFiles.map((file) =>
          file._id === action.payload._id
            ? { ...file, ...action.payload }  // Create a new object with merged properties
            : file
        ),
        currentFile:
          state.currentFile?._id === action.payload._id
            ? { ...state.currentFile, ...action.payload }  // Create a new object here too
            : state.currentFile,
      };
    case ADD_FILE:
      return {
        ...state,
        repositoryFiles: [...state.repositoryFiles, action.payload],
      };
    default:
      return state;
  }
}

// API Action Helpers
export const fetchFile = (fileId) => async (dispatch) => {
  dispatch(actions.setFileLoading(true));
  try {
    const data = await filesApi.getFileById(fileId);
    dispatch(actions.setFile(data));
  } catch (error) {
    dispatch(actions.setFileError(error.message));
  } finally {
    dispatch(actions.setFileLoading(false));
  }
};

export const fetchRepositoryFiles = (repoId) => async (dispatch) => {
  dispatch(actions.setFileLoading(true));
  try {
    const data = await filesApi.getFilesByRepository(repoId);
    dispatch(actions.setRepositoryFiles(data));
  } catch (error) {
    dispatch(actions.setFileError(error.message));
  } finally {
    dispatch(actions.setFileLoading(false));
  }
};
