const initialState = {
  currentUser: null
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      return { ...state, currentUser: null };
    default:
      return state;
  }
};

export const setCurrentUser = (user) => ({
  type: "SET_CURRENT_USER",
  payload: user
});

export const logout = () => ({
  type: "LOGOUT"
});

export default accountReducer;
