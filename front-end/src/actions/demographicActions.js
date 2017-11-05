import _ from 'lodash';
import { filterData } from './filterActions';

const fixAge = (row) => {
  switch (row.age_cod) {
    case 'DEC':
      row.age *= 10;
      break;
    case 'YR':
      break;
    case 'MON':
      row.age /= 12;
      break;
    case 'WK':
      row.age /= 52;
      break;
    case 'DY':
      row.age /= 365;
      break;
    case 'HR':
      row.age /= 8760;
      break;
    default:
      row.age = -1;
      break;
  }
};
const fixSex = (row) => {
  if (!row.sex) row.sex = 'UNK';
};
const fixCountry = (row) => {
  if (!row.occr_country) row.occr_country = 'UNK';
};

const fixers = [
  fixAge,
  fixSex,
  fixCountry,
];

const countCountry = row => row.occr_country;
const countSex = row => row.sex;
const countAge = (row) => {
  const ageRange = [
    'UNK',
    '0-5',
    '05-10',
    '10-20',
    '20-30',
    '30-40',
    '40-50',
    '50-60',
    '60-70',
    '70-80',
    '80-90',
    '90-99',
    '99+',
  ];
  if (row.age < 0) {
    return ageRange[0];
  } else if (row.age >= 0 && row.age <= 5) {
    return ageRange[1];
  } else if (row.age > 5 && row.age <= 10) {
    return ageRange[2];
  } else if (row.age > 10 && row.age <= 20) {
    return ageRange[3];
  } else if (row.age > 20 && row.age <= 30) {
    return ageRange[4];
  } else if (row.age > 30 && row.age <= 40) {
    return ageRange[5];
  } else if (row.age > 40 && row.age <= 50) {
    return ageRange[6];
  } else if (row.age > 50 && row.age <= 60) {
    return ageRange[7];
  } else if (row.age > 60 && row.age <= 70) {
    return ageRange[8];
  } else if (row.age > 70 && row.age <= 80) {
    return ageRange[9];
  } else if (row.age > 80 && row.age <= 90) {
    return ageRange[10];
  } else if (row.age > 90 && row.age <= 99) {
    return ageRange[11];
  }
  return ageRange[12];
};

const counters = {
  sex: countSex,
  age: countAge,
  country: countCountry,
};

const handleAccumulator = (accumulator, row) => {
  for (const type in counters) {
    const label = counters[type](row);
    if (!(label in accumulator[type])) {
      accumulator[type][label] = 1;
    } else {
      accumulator[type][label] += 1;
    }
  }
};

const reduceData = rows => rows.reduce((accumulator, row) => {
  fixers.forEach(fix => fix(row));
  handleAccumulator(accumulator, row);
  return accumulator;
}, {
  sex: {
    F: 0,
    M: 0,
    UNK: 0,
  },
  age: {
    '0-5': 0,
    '05-10': 0,
    '10-20': 0,
    '20-30': 0,
    '30-40': 0,
    '40-50': 0,
    '50-60': 0,
    '60-70': 0,
    '70-80': 0,
    '80-90': 0,
    '90-99': 0,
    '99+': 0,
    UNK: 0,
  },
  country: [],
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

  console.log(fetchData.body);

  fetch('http://localhost:3001/getdata', fetchData)
    .then(response => response.json())
    .then((allReports) => {
      const reducedData = reduceData(allReports.rows);
      const demographics = {
        sex: _.sortBy(Object.keys(reducedData.sex)
          .map(sexRange => ({ sex: sexRange, count: reducedData.sex[sexRange] })), 'sex'),
        age: _.sortBy(Object.keys(reducedData.age)
          .map(ageRange => ({ age: ageRange, count: reducedData.age[ageRange] })), 'age'),
        location: _.reverse(_.sortBy(Object.keys(reducedData.country)
          .map(countryRange => ({ country: countryRange, count: reducedData.country[countryRange] })), 'count')),
        selectedDates: {
          startDate: Number(queryParams.startDate),
          endDate: Number(queryParams.endDate),
        },
      };
      console.log('demographics');
      console.log(demographics);
      dispatch({ type: 'UPDATE_DEMOGRAPHICS', demographics });
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

export const toggleSexFilter = filter => (dispatch, getState) => {
  if (getState().filters.sex.includes(filter)) {
    dispatch({ type: 'SET_SEX', sex: getState().filters.sex.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_SEX', sex: getState().filters.sex.concat(filter) });
    dispatch(filterData());
  }
};

export const toggleAgeFilter = filter => (dispatch) => {
};

export const toggleLocationFilter = filter => (dispatch, getState) => {
  if (getState().filters.occr_country.includes(filter)) {
    dispatch({ type: 'SET_LOCATION', occr_country: getState().filters.occr_country.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_LOCATION', occr_country: getState().filters.occr_country.concat(filter) });
    dispatch(filterData());
  }
};
