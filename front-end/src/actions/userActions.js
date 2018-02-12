/**
 * Gets the data to build the timeline for the entire database
 */
export const setUserInfo = (isLoggedIn, userEmail, userID) => (dispatch) => {
  console.log(isLoggedIn, userEmail, userID);
  return dispatch({ type: 'SET_USER', userInfo: { isLoggedIn, userEmail, userID } });
};

export const checkUserTrash = userID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID }),
  };

  return fetch('http://localhost:3001/getusertrash', fetchData)
    .then(response => response.json())
    .then((bins) => {
      console.log('Checking for user', bins);
      if (bins.rows.length > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

export const makeUserTrash = userID => () => {
  const fetchData = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID }),
  };
  fetch('http://localhost:3001/makeusertrash', fetchData);
  console.log('tried to run make trash user');
};
