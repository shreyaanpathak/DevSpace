import { repositoriesApi } from '../api/repositories';

// Action Types
const SET_REPOSITORY = 'repository/SET_REPOSITORY';
const SET_COLLABORATORS = 'repository/SET_COLLABORATORS';
const SET_REPOSITORY_LOADING = 'repository/SET_REPOSITORY_LOADING';
const SET_REPOSITORY_ERROR = 'repository/SET_REPOSITORY_ERROR';
const UPDATE_COLLABORATOR_STATUS = 'repository/UPDATE_COLLABORATOR_STATUS';

// Initial State
const initialState = {
    currentRepository: null,
    collaborators: [],
    loading: false,
    error: null
};

// Reducer
export default function repositoryReducer(state = initialState, action) {
    switch (action.type) {
        case SET_REPOSITORY:
            return { ...state, currentRepository: action.payload, error: null };
        case SET_COLLABORATORS:
            return { ...state, collaborators: action.payload, error: null };
        case SET_REPOSITORY_LOADING:
            return { ...state, loading: action.payload };
        case SET_REPOSITORY_ERROR:
            return { ...state, error: action.payload, loading: false };
        case UPDATE_COLLABORATOR_STATUS: {
            const { userId, status } = action.payload;
            return {
                ...state,
                collaborators: state.collaborators.map(collaborator =>
                    collaborator.id === userId
                        ? { ...collaborator, status }
                        : collaborator
                )
            };
        }
        default:
            return state;
    }
}

// Action Creators
export const fetchRepository = (repoId) => async (dispatch) => {
    dispatch({ type: SET_REPOSITORY_LOADING, payload: true });
    try {
        const data = await repositoriesApi.getRepositoryById(repoId);
        dispatch({ type: SET_REPOSITORY, payload: data });
    } catch (error) {
        dispatch({ type: SET_REPOSITORY_ERROR, payload: error.message });
    } finally {
        dispatch({ type: SET_REPOSITORY_LOADING, payload: false });
    }
};

export const fetchCollaborators = (repoId) => async (dispatch) => {
    try {
        const data = await repositoriesApi.getRepositoryCollaborators(repoId);
        dispatch({ type: SET_COLLABORATORS, payload: data });
    } catch (error) {
        dispatch({ type: SET_REPOSITORY_ERROR, payload: error.message });
    }
};

