/**
 * Queries the Database with the current userID to retrieve that user's bin names
 */
export const getUserBins = userID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID,
    }),
  };
  return fetch('http://localhost:3001/getuserbins', fetchData)
    .then(response => response.json())
    .then(bins => bins.rows)
    .catch((err) => {
      console.error.bind(err);
    });
};

/**
 * Queries the Database with the current userID and a bin name to create
 * that bin in the database
 */
export const createUserBin = (userID, binName) => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID,
      binName,
    }),
  };
  fetch('http://localhost:3001/createuserbin', fetchData);
};

/**
 * Queries the Database with a primaryid, two bins, and the current userID to
 * move a report from one bin to another
 */
export const moveReport = (primaryid, fromBin, toBin, userID) => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      primaryid,
      fromBin,
      toBin,
      userID,
    }),
  };
  return fetch('http://localhost:3001/binreport', fetchData);
};

/**
 * Queries the Database with currently selected filters, a bin, and a userID to retrieve
 * that user's reports contained in specified bin that fit in filters
 */
export const getCaseReports = (filters, bin, userID) => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...filters,
      bin,
      userID,
    }),
  };
  return fetch('http://localhost:3001/getreports', fetchData)
    .then(response => response.json())
    .then(reports => reports.rows);
};
  
export const getUserBins = userID => () => {
    const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userID,
    }),
    };
    return fetch('http://localhost:3001/getuserbins', fetchData)
    .then(response => response.json())
    .then((bins) => {
        return bins.rows;
    })
    .catch((err) => {
        console.error.bind(err);
    });
};

export const createUserBin = (userID, binName) => () => {
    const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userID,
        binName,
    }),
    };
    fetch('http://localhost:3001/createuserbin', fetchData)
};