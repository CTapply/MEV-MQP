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
 * Queries the Database with a caseID to get the case name
 * that user's reports contained in specified bin that fit in filters
 */
export const getCaseNameByID = caseID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caseID,
    }),
  };

  return fetch('http://localhost:3001/getcasename', fetchData)
    .then(response => response.json())
    .then(reports => (reports.rows ? reports.rows : []));
};

/**
 * Queries the Database with currently selected filters, a bin, and a userID to retrieve
 * that user's reports contained in specified bin that fit in filters
 */
export const getCaseReports = (bin, userID, filters) => (dispatch, getState) => {
  const defaultFilters = {
    init_fda_dt: {
      start: '1',
      end: '9999999999',
    },
    sex: [],
    occr_country: [],
    age: [],
    occp_cod: [],
    meType: [],
    product: [],
    stage: [],
    cause: [],
  };

  const filtersToUse = (filters) ? Object.assign(defaultFilters, filters) : getState().filters;
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...filtersToUse,
      bin,
      userID,
    }),
  };

  return fetch('http://localhost:3001/getreports', fetchData)
    .then(response => response.json())
    .then(reports => (reports.rows ? reports.rows : []));
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
 * Queries the Database with a userID and an (optional) caseName
 * If caseName is not present, its get reports in any case
 * to get that report PrimaryIDs that exist in a case already
 */
export const getReportsInCases = (userID, caseName) => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID,
      caseName,
    }),
  };

  return fetch('http://localhost:3001/getreportsincases', fetchData)
    .then(response => response.json())
    .then(response => (response.rows ? response.rows : []))
    .catch(err => console.log('Failed to retrieve reports in Cases', err));
};

/**
 * Queries the Database with a caseID to get
 * the tags of the reports from the case
 */
export const getTagsinCase = caseID => () => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caseID,
    }),
  };

  return fetch('http://localhost:3001/getcasetags', fetchData)
    .then(response => response.json())
    .then(response => (response.rows ? response.rows : []))
    .catch(err => console.log('Failed to retrieve tags in that case', err));
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
