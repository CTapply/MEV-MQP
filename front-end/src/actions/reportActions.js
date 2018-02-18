/**
 * Queries the Database with the current userID to retrieve that user's bin names
 */
export const getUserCases = userID => () => {
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
  return fetch('http://localhost:3001/getusercases', fetchData)
    .then(response => response.json())
    .then(bins => (bins.rows || []))
    .catch((err) => {
      console.error.bind(err);
    });
};

/**
 * Queries the Database with the current userID and a bin name to create
 * that bin in the database
 */
export const createUserBin = (userID, binName, binDesc) => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID,
      binName,
      binDesc,
    }),
  };
  return fetch('http://localhost:3001/createuserbin', fetchData)
    .then(response => response.json())
    .then((bins) => {
      if (bins.rows[0]) {
        return bins.rows[0].case_id;
      }
      return -1;
    });
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

/**
 * Queries the Database with a primaryid to get
 * that report's narrative text
 */
export const getReportNarrativeFromID = primaryid => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ primaryid }),
  };

  return fetch('http://localhost:3001/getreporttext', fetchData)
    .then(response => response.json())
    .then(report => report.rows)
    .catch(err => console.log('Failed to retrieve report text', err));
};

/**
 * Queries the Database with a userID to get
 * that report PrimaryIDs that exist in a case already
 */
export const getReportsInCases = userID => () => {
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

  return fetch('http://localhost:3001/getreportsincases', fetchData)
    .then(response => response.json())
    .then(response => response.rows)
    .catch(err => console.log('Failed to retrieve reports in Cases', err));
};

export const archiveCase = (name, active, userID) => () => {
  const fetchData = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      active,
      userID,
    }),
  };

  fetch('http://localhost:3001/archivecase', fetchData);
};
