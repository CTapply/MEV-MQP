import _ from 'lodash';
import { filterData } from './filterActions';

// Default Objects for graphs columns with no data
const defaultSexObject = {
  F: { count: 0, serious: 0 },
  M: { count: 0, serious: 0 },
  UNK: { count: 0, serious: 0 },
};

const defaultAgeObject = {
  '0-5': { count: 0, serious: 0 },
  '06-09': { count: 0, serious: 0 },
  '10-19': { count: 0, serious: 0 },
  '20-29': { count: 0, serious: 0 },
  '30-39': { count: 0, serious: 0 },
  '40-49': { count: 0, serious: 0 },
  '50-59': { count: 0, serious: 0 },
  '60-69': { count: 0, serious: 0 },
  '70-79': { count: 0, serious: 0 },
  '80-89': { count: 0, serious: 0 },
  '90-99': { count: 0, serious: 0 },
  '99+': { count: 0, serious: 0 },
  UNK: { count: 0, serious: 0 },
};

const defaultLocationObject = {
  US: { count: 0, serious: 0 },
  CA: { count: 0, serious: 0 },
  JP: { count: 0, serious: 0 },
  GB: { count: 0, serious: 0 },
  FR: { count: 0, serious: 0 },
  UNK: { count: 0, serious: 0 },
};

const defaultOccupationObject = {
  MD: { count: 0, serious: 0 },
  PH: { count: 0, serious: 0 },
  OT: { count: 0, serious: 0 },
  LW: { count: 0, serious: 0 },
  CN: { count: 0, serious: 0 },
  UNK: { count: 0, serious: 0 },
};


/**
 * Removes the NULL values from the data
 * @param {object} row a single row from the database
 */
const cleanRow = (row) => {
  if (row.age === null) row.age = 'UNK';
  if (!row.sex) row.sex = 'UNK';
  if (!row.occr_country) row.occr_country = 'UNK';
  if (!row.occp_cod) row.occp_cod = 'UNK';
  if (!row.outc_cod) row.outc_cod = 'UNK';
};

/**
 * returns the correct attribute from the row
 * @param {object} row a single row from the database
 */
const countCountry = row => row.occr_country;
const countOccupation = row => row.occp_cod;
const countSex = row => row.sex;
const countAge = (row) => {
  const ageRange = Object.keys(defaultAgeObject).sort();
  if (row.age === 'UNK') {
    return 'UNK';
  }

  // Groups the ages into ranges and returns the correct age range for a given row
  let index = Math.min(Math.floor(row.age / 10) + 1, 11);
  if (index === 1 && (row.age / 10) <= 0.5) index = 0;
  if (index < 0) return 'UNK';
  return ageRange[index];
};

// Used to see which demographic we are currently accumulating
const counters = {
  sex: countSex,
  age: countAge,
  country: countCountry,
  occp_cod: countOccupation,
};

/**
 * Gets a total count as well as a count for each outcome code
 * for a specific given demographic
 * @param {object} accumulator object that stores all of the totals so far
 * @param {object} row a single row from the database
 * @param {string} demo current demographic we are looking for
 */
const accumlateForEachOutcome = (accumulator, row, demo) => {
  let isSerious = false;
  row.outc_cod.forEach((outcome) => {
    if (outcome) {
      isSerious = true;
      const outcomeValue = _.get(accumulator, [demo, counters[demo](row), outcome], 0);
      _.set(accumulator, [demo, counters[demo](row), outcome], outcomeValue + 1);
    } else {
      const outcomeValue = _.get(accumulator, [demo, counters[demo](row), 'UNK'], 0);
      _.set(accumulator, [demo, counters[demo](row), 'UNK'], outcomeValue + 1);
    }
  });
  if (isSerious) {
    const seriousCountValue = _.get(accumulator, [demo, counters[demo](row), 'serious'], 0);
    _.set(accumulator, [demo, counters[demo](row), 'serious'], seriousCountValue + 1);
  }
};

/**
 * Gets a total count as well as a count for each outcome code
 * @param {object} accumulator object that stores all of the totals
 * @param {object} row a single row from the database
 */
const handleAccumulator = (accumulator, row) => {
  Object.keys(counters).forEach((demo) => {
    const countValue = _.get(accumulator, [demo, counters[demo](row), 'count'], 0);
    _.set(accumulator, [demo, counters[demo](row), 'count'], countValue + 1);
    accumlateForEachOutcome(accumulator, row, demo);
  });
};

/**
 * Takes all of the data from the database then
 * aggregates, sorts and counts the data
 * @param {array} rows a single row from the database
 */
const reduceData = rows => rows.reduce((accumulator, row) => {
  cleanRow(row);
  handleAccumulator(accumulator, row);
  return accumulator;
}, {
  sex: JSON.parse(JSON.stringify(defaultSexObject)),
  age: JSON.parse(JSON.stringify(defaultAgeObject)),
  country: JSON.parse(JSON.stringify(defaultLocationObject)),
  occp_cod: JSON.parse(JSON.stringify(defaultOccupationObject)),
});

/**
 * Query the database for demographic data with the given parameters
 * @param {object} queryParams paramerters to filter the database query by
 */
export const getDemographicData = queryParams => (dispatch) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...queryParams,
    }),
  };

  fetch('http://localhost:3001/getdemographicdata', fetchData)
    .then(response => response.json())
    .then((allReports) => {
      const reducedData = reduceData(allReports.rows);
      const demographics = {
        sex: _.sortBy(Object.keys(reducedData.sex)
          .map(sexRange => ({ sex: sexRange, ...reducedData.sex[sexRange] })), 'sex'),
        age: _.sortBy(Object.keys(reducedData.age)
          .map(ageRange => ({ age: ageRange, ...reducedData.age[ageRange] })), 'age'),
        location: _.reverse(_.sortBy(Object.keys(reducedData.country)
          .map(countryRange => ({ country: countryRange, ...reducedData.country[countryRange] })), 'count')).slice(0, 10),
        occp_cod: _.reverse(_.sortBy(Object.keys(reducedData.occp_cod)
          .map(occpRange => ({ occp_cod: occpRange, ...reducedData.occp_cod[occpRange] })), 'count')),
      };
      console.log('Updated Demographics');
      dispatch({ type: 'UPDATE_DEMOGRAPHICS', demographics });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleSexFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.sex.length !== 0) {
      dispatch({ type: 'SET_SEX', sex: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.sex.includes(filter)) {
    dispatch({ type: 'SET_SEX', sex: getState().filters.sex.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_SEX', sex: getState().filters.sex.concat(filter) });
    dispatch(filterData());
  }
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleAgeFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.age.length !== 0) {
      dispatch({ type: 'SET_AGE', age: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.age.includes(filter)) {
    dispatch({ type: 'SET_AGE', age: getState().filters.age.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_AGE', age: getState().filters.age.concat(filter) });
    dispatch(filterData());
  }
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleLocationFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.occr_country.length !== 0) {
      dispatch({ type: 'SET_LOCATION', occr_country: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.occr_country.includes(filter)) {
    dispatch({ type: 'SET_LOCATION', occr_country: getState().filters.occr_country.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_LOCATION', occr_country: getState().filters.occr_country.concat(filter) });
    dispatch(filterData());
  }
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleOccupationFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.occp_cod.length !== 0) {
      dispatch({ type: 'SET_OCCUPATION', occp_cod: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.occp_cod.includes(filter)) {
    dispatch({ type: 'SET_OCCUPATION', occp_cod: getState().filters.occp_cod.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_OCCUPATION', occp_cod: getState().filters.occp_cod.concat(filter) });
    dispatch(filterData());
  }
};

export const setDemographicsMinimizedToggle = toggle =>
  dispatch => dispatch({ type: 'TOGGLE_DEMOGRAPHICS_MINIMIZED', demographicsMinimized: toggle });
