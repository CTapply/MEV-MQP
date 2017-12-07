const initialUserState = {
  isLoggedIn: false,
  userEmail: -1,
  userID: '',
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the Demographics
 */
export default (state = initialUserState, action = {}) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, { ...action.userInfo });
    default: return state;
  }
};
