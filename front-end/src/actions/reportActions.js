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
  fetch('http://localhost:3001/binreport', fetchData);
};

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

