import _ from 'lodash';
import { filterData } from './filterActions';

const cleanRow = (row) => {
  if (row.age === null) row.age = 'UNK';
  if (!row.sex) row.sex = 'UNK';
  if (!row.occr_country) row.occr_country = 'UNK';
  if (!row.occp_cod) row.occp_cod = 'UNK';
  if (!row.outc_cod) row.outc_cod = 'UNK';
};

const countCountry = row => row.occr_country;
const countSex = row => row.sex;
const countAge = (row) => {
  // const ageRange = ['0-5', '06-09', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99', '99+'];
  const ageRange = Object.keys(defaultAgeObject).sort();
  if (row.age === 'UNK') {
    return 'UNK';
  }

  let index = Math.min(Math.floor(row.age / 10) + 1, 11);
  if (index === 1 && (row.age / 10) <= 0.5) index = 0;
  if (index < 0) return 'UNK';
  return ageRange[index];
};

const counters = {
  sex: countSex,
  age: countAge,
  country: countCountry,
};

const handleAccumulator = (accumulator, row) => {
  Object.keys(counters).forEach((demo) => {
    const outcomeValue = _.result(accumulator, [demo, counters[demo](row), row.outc_cod], 0);
    _.set(accumulator, [demo, counters[demo](row), row.outc_cod], outcomeValue + 1);
    if (row.outc_cod !== 'UNK') {
      const seriousCountValue = _.result(accumulator, [demo, counters[demo](row), 'serious'], 0);
      _.set(accumulator, [demo, counters[demo](row), 'serious'], seriousCountValue + 1);
    }
    const countValue = _.result(accumulator, [demo, counters[demo](row), 'count'], 0);
    _.set(accumulator, [demo, counters[demo](row), 'count'], countValue + 1);
  });
};

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
};

const reduceData = rows => rows.reduce((accumulator, row) => {
  cleanRow(row);
  handleAccumulator(accumulator, row);
  return accumulator;
}, {
  sex: JSON.parse(JSON.stringify(defaultSexObject)),
  age: JSON.parse(JSON.stringify(defaultAgeObject)),
  country: JSON.parse(JSON.stringify(defaultLocationObject)),
});

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

  fetch('http://localhost:3001/getdata', fetchData)
    .then(response => response.json())
    .then((allReports) => {
      const reducedData = reduceData(allReports.rows);
      const demographics = {
        sex: _.sortBy(Object.keys(reducedData.sex)
          .map(sexRange => ({ sex: sexRange, ...reducedData.sex[sexRange] })), 'sex'),
        age: _.sortBy(Object.keys(reducedData.age)
          .map(ageRange => ({ age: ageRange, ...reducedData.age[ageRange] })), 'age'),
        location: _.reverse(_.sortBy(Object.keys(reducedData.country)
          .map(countryRange => ({ country: countryRange, ...reducedData.country[countryRange] })), 'count')),
      };
      console.log('Updated Demographics', demographics);
      dispatch({ type: 'UPDATE_DEMOGRAPHICS', demographics });
    })
    .catch((err) => {
      console.log(err);
    });
};

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
