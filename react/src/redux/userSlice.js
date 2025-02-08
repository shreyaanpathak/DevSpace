import { usersApi } from '../api/users';

// Action Types
const SET_USER = 'user/SET_USER';
const SET_USER_STATS = 'user/SET_USER_STATS';
const SET_USER_PROJECTS = 'user/SET_USER_PROJECTS';
const SET_USER_ACTIVITIES = 'user/SET_USER_ACTIVITIES';
const SET_USER_LOADING = 'user/SET_USER_LOADING';
const SET_USER_ERROR = 'user/SET_USER_ERROR';

// Initial State
const initialState = {
  userData: null,
  stats: null,
  projects: [],
  activities: [],
  loading: false,
  error: null
};

// Reducer
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, userData: action.payload, error: null };
    case SET_USER_STATS:
      return { ...state, stats: action.payload, error: null };
    case SET_USER_PROJECTS:
      return { ...state, projects: action.payload, error: null };
    case SET_USER_ACTIVITIES:
      return { ...state, activities: action.payload, error: null };
    case SET_USER_LOADING:
      return { ...state, loading: action.payload };
    case SET_USER_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Action Creators
export const fetchUser = (userId) => async (dispatch) => {
  dispatch({ type: SET_USER_LOADING, payload: true });
  try {
    const data = await usersApi.getUserById(userId);
    dispatch({ type: SET_USER, payload: data });
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, payload: error.message });
  } finally {
    dispatch({ type: SET_USER_LOADING, payload: false });
  }
};

export const fetchUserStats = (userId) => async (dispatch) => {
  try {
    const data = await usersApi.getUserStats(userId);
    dispatch({ type: SET_USER_STATS, payload: data });
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, payload: error.message });
  }
};

export const fetchUserProjects = (userId) => async (dispatch) => {
  try {
    const data = await usersApi.getUserProjects(userId);
    dispatch({ type: SET_USER_PROJECTS, payload: data });
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, payload: error.message });
  }
};

export const fetchUserActivities = (userId) => async (dispatch) => {
  try {
    const data = await usersApi.getUserActivities(userId);
    dispatch({ type: SET_USER_ACTIVITIES, payload: data });
  } catch (error) {
    dispatch({ type: SET_USER_ERROR, payload: error.message });
  }
};