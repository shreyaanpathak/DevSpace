import { filesApi } from '../api/files';

// Action Types
const SET_FILE = 'file/SET_FILE';
const SET_REPOSITORY_FILES = 'file/SET_REPOSITORY_FILES';
const SET_FILE_LOADING = 'file/SET_FILE_LOADING';
const SET_FILE_ERROR = 'file/SET_FILE_ERROR';

// Initial State
const initialState = {
  currentFile: null,
  repositoryFiles: [],
  loading: false,
  error: null
};

// Reducer
export default function fileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILE:
      return { ...state, currentFile: action.payload, error: null };
    case SET_REPOSITORY_FILES:
      return { ...state, repositoryFiles: action.payload, error: null };
    case SET_FILE_LOADING:
      return { ...state, loading: action.payload };
    case SET_FILE_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Action Creators
export const fetchFile = (fileId) => async (dispatch) => {
  dispatch({ type: SET_FILE_LOADING, payload: true });
  try {
    const data = await filesApi.getFileById(fileId);
    dispatch({ type: SET_FILE, payload: data });
  } catch (error) {
    dispatch({ type: SET_FILE_ERROR, payload: error.message });
  } finally {
    dispatch({ type: SET_FILE_LOADING, payload: false });
  }
};

export const fetchRepositoryFiles = (repoId) => async (dispatch) => {
  try {
    const data = await filesApi.getFilesByRepository(repoId);
    dispatch({ type: SET_REPOSITORY_FILES, payload: data });
  } catch (error) {
    dispatch({ type: SET_FILE_ERROR, payload: error.message });
  }
};