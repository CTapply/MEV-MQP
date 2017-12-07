export const asd = () => {};
/**
 * Gets the data to build the timeline for the entire database
 */
export const setUserInfo = (isLoggedIn, userEmail, userID) => (dispatch) => {
  console.log(isLoggedIn, userEmail, userID);
  dispatch({ type: 'SET_USER', userInfo: { isLoggedIn, userEmail, userID } });
};
