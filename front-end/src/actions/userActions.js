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

  return fetch(`${process.env.REACT_APP_NODE_SERVER}/getusertrash`, fetchData)
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

export const checkUserRead = userID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID }),
  };

  return fetch(`${process.env.REACT_APP_NODE_SERVER}/getuserread`, fetchData)
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
  return fetch(`${process.env.REACT_APP_NODE_SERVER}/makeusertrash`, fetchData);
};

export const makeUserRead = userID => () => {
  const fetchData = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID }),
  };
  return fetch(`${process.env.REACT_APP_NODE_SERVER}/makeuserread`, fetchData);
};

export const getUserInactiveCasesCount = userID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID }),
  };

  return fetch(`${process.env.REACT_APP_NODE_SERVER}/getinactivecases`, fetchData)
    .then(response => response.json())
    .then((bins) => {
      if (bins.rows[0]) {
        return bins.rows.length;
      }
      return 0;
   });
};
export const getUserActiveCasesCount = userID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID }),
  };
  return fetch(`${process.env.REACT_APP_NODE_SERVER}/getactivecases`, fetchData)
    .then(response => response.json())
    .then((bins) => {
      if (bins.rows[0]) {
        return bins.rows.length;
      }
      return 0;
    });
};
