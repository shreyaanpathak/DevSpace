import { repositoriesApi } from '../api/repositories';

// Action Types
export const SET_REPOSITORY = 'repository/SET_REPOSITORY';
export const SET_COLLABORATORS = 'repository/SET_COLLABORATORS';
export const SET_REPOSITORY_LOADING = 'repository/SET_REPOSITORY_LOADING';
export const SET_REPOSITORY_ERROR = 'repository/SET_REPOSITORY_ERROR';
export const UPDATE_COLLABORATOR_STATUS = 'repository/UPDATE_COLLABORATOR_STATUS';
export const SET_ACCESSIBLE_REPOSITORIES = 'repository/SET_ACCESSIBLE_REPOSITORIES';
export const ADD_REPOSITORY = 'repository/ADD_REPOSITORY';
export const UPDATE_REPOSITORY = 'repository/UPDATE_REPOSITORY';
export const DELETE_REPOSITORY = 'repository/DELETE_REPOSITORY';

const initialState = {
  currentRepository: null,
  accessibleRepositories: [],
  collaborators: [],
  loading: false,
  error: null
};

// Action Creators
export const actions = {
  setRepository: (payload) => ({ 
    type: SET_REPOSITORY, 
    payload 
  }),
  setAccessibleRepositories: (payload) => ({ 
    type: SET_ACCESSIBLE_REPOSITORIES, 
    payload 
  }),
  setCollaborators: (payload) => ({ 
    type: SET_COLLABORATORS, 
    payload 
  }),
  setRepositoryLoading: (payload) => ({ 
    type: SET_REPOSITORY_LOADING, 
    payload 
  }),
  setRepositoryError: (payload) => ({ 
    type: SET_REPOSITORY_ERROR, 
    payload 
  }),
  updateCollaboratorStatus: (payload) => ({ 
    type: UPDATE_COLLABORATOR_STATUS, 
    payload 
  }),
  addRepository: (payload) => ({ 
    type: ADD_REPOSITORY, 
    payload 
  }),
  updateRepository: (payload) => ({ 
    type: UPDATE_REPOSITORY, 
    payload 
  }),
  deleteRepository: (payload) => ({ 
    type: DELETE_REPOSITORY, 
    payload 
  })
};

// Reducer
export default function repositoryReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REPOSITORY:
      return { 
        ...state, 
        currentRepository: action.payload, 
        error: null 
      };

    case SET_ACCESSIBLE_REPOSITORIES:
      return {
        ...state,
        accessibleRepositories: action.payload,
        error: null
      };

    case SET_COLLABORATORS:
      return { 
        ...state, 
        collaborators: action.payload, 
        error: null 
      };

    case SET_REPOSITORY_LOADING:
      return { 
        ...state, 
        loading: action.payload 
      };

    case SET_REPOSITORY_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };

    case UPDATE_COLLABORATOR_STATUS: {
      const { userId, status } = action.payload;
      return {
        ...state,
        collaborators: state.collaborators.map(collaborator =>
          collaborator.id === userId ? 
            { ...collaborator, status } : 
            collaborator
        )
      };
    }

    case ADD_REPOSITORY:
      return {
        ...state,
        accessibleRepositories: [...state.accessibleRepositories, action.payload]
      };

    case UPDATE_REPOSITORY:
      return {
        ...state,
        accessibleRepositories: state.accessibleRepositories.map(repo =>
          repo._id === action.payload._id ? action.payload : repo
        ),
        currentRepository: state.currentRepository?._id === action.payload._id ?
          action.payload : state.currentRepository
      };

    case DELETE_REPOSITORY:
      return {
        ...state,
        accessibleRepositories: state.accessibleRepositories.filter(
          repo => repo._id !== action.payload
        ),
        currentRepository: state.currentRepository?._id === action.payload ?
          null : state.currentRepository
      };

    default:
      return state;
  }
}

// API Action Helpers
export const fetchRepository = (repoId) => async (dispatch) => {
  dispatch(actions.setRepositoryLoading(true));
  try {
    const data = await repositoriesApi.getRepositoryById(repoId);
    dispatch(actions.setRepository(data));
  } catch (error) {
    dispatch(actions.setRepositoryError(error.message));
  } finally {
    dispatch(actions.setRepositoryLoading(false));
  }
};

export const fetchAccessibleRepositories = () => async (dispatch) => {
  dispatch(actions.setRepositoryLoading(true));
  try {
    const data = await repositoriesApi.getAccessibleRepositories();
    dispatch(actions.setAccessibleRepositories(data));
  } catch (error) {
    dispatch(actions.setRepositoryError(error.message));
  } finally {
    dispatch(actions.setRepositoryLoading(false));
  }
};

export const fetchCollaborators = (repoId) => async (dispatch) => {
  try {
    const data = await repositoriesApi.getRepositoryCollaborators(repoId);
    dispatch(actions.setCollaborators(data));
  } catch (error) {
    dispatch(actions.setRepositoryError(error.message));
  }
};

export const createRepository = (repository) => async (dispatch) => {
  dispatch(actions.setRepositoryLoading(true));
  try {
    const data = await repositoriesApi.createRepository(repository);
    dispatch(actions.addRepository(data));
    return data;
  } catch (error) {
    dispatch(actions.setRepositoryError(error.message));
    throw error;
  } finally {
    dispatch(actions.setRepositoryLoading(false));
  }
};

export const updateRepository = (repoId, repository) => async (dispatch) => {
  dispatch(actions.setRepositoryLoading(true));
  try {
    const data = await repositoriesApi.updateRepository(repoId, repository);
    dispatch(actions.updateRepository(data));
    return data;
  } catch (error) {
    dispatch(actions.setRepositoryError(error.message));
    throw error;
  } finally {
    dispatch(actions.setRepositoryLoading(false));
  }
};

export const deleteRepository = (repoId) => async (dispatch) => {
  dispatch(actions.setRepositoryLoading(true));
  try {
    await repositoriesApi.deleteRepository(repoId);
    dispatch(actions.deleteRepository(repoId));
  } catch (error) {
    dispatch(actions.setRepositoryError(error.message));
    throw error;
  } finally {
    dispatch(actions.setRepositoryLoading(false));
  }
};
