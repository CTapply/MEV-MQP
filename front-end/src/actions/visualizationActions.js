import _ from 'lodash';

const fixAge = (row) => {
  switch (row.age_cod) {
    case 'DEC':
      return row.age * 10;
    case 'YR':
      return row.age;
    case 'MON':
      return row.age / 12;
    case 'WK':
      return row.age / 52;
    case 'DY':
      return row.age / 365;
    case 'HR':
      return row.age / 8760;
    default:
      return row.age;
  }
};

const ageAdapter = (rows) => {
  const counts = _(rows).map(fixAge).countBy(Math.floor).value();
  const ageArray = [];
  const ageRange = [
    '0-5',
    '5-10',
    '10-20',
    '20-30',
    '30-40',
    '40-50',
    '50-60',
    '60-70',
    '70-80',
    '80-90',
    '90-100',
    '100+',
  ];
  const ageRangeCount = new Array(12);
  ageRangeCount.fill(0);
  _.forIn(counts, (value, key) => {
    if (key <= 5) {
      ageRangeCount[0] += 1;
    } else if (key > 5 && key <= 10) {
      ageRangeCount[1] += 1;
    } else if (key > 10 && key <= 20) {
      ageRangeCount[2] += 1;
    } else if (key > 20 && key <= 30) {
      ageRangeCount[3] += 1;
    } else if (key > 30 && key <= 40) {
      ageRangeCount[4] += 1;
    } else if (key > 40 && key <= 50) {
      ageRangeCount[5] += 1;
    } else if (key > 50 && key <= 60) {
      ageRangeCount[6] += 1;
    } else if (key > 60 && key <= 70) {
      ageRangeCount[7] += 1;
    } else if (key > 70 && key <= 80) {
      ageRangeCount[8] += 1;
    } else if (key > 80 && key <= 90) {
      ageRangeCount[9] += 1;
    } else if (key > 90 && key <= 100) {
      ageRangeCount[10] += 1;
    } else {
      ageRangeCount[11] += 1;
    }
  });
  for (let i = 0; i < ageRange.length; i += 1) {
    ageArray.push({
      age: ageRange[i],
      count: ageRangeCount[i],
    });
  }
  return ageArray;
};

const fixSex = row => (row.sex ? row.sex : 'UNK');
const sexAdapter = (rows) => {
  const counts = _(rows).map(fixSex).countBy().value();
  const sexArray = [];
  _.forIn(counts, (value, key) => {
    sexArray.push({
      sex: key,
      count: value,
    });
  });
  return sexArray;
};

const fixCountry = row => (row.occr_country ? row.occr_country : 'UNK');
const countryAdapter = (rows) => {
  const counts = _(rows).map(fixCountry).countBy().value();
  const countryArray = [];
  _.forIn(counts, (value, key) => {
    countryArray.push({
      country: key,
      count: value,
    });
  });
  return countryArray;
};

export const getData = queryParams => (dispatch) => {
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

  console.log(queryParams);

  fetch('http://localhost:3001/getdata', fetchData)
    .then(response => response.json())
    .then((things) => {
      console.log(things.rows);
      dispatch({ type: 'UPDATE_DATA', things: JSON.stringify(things.rows, null, 2) });

      const demographics = {
        sex: sexAdapter(things.rows),
        age: ageAdapter(things.rows),
        location: countryAdapter(things.rows),
        selectedDates: {
          startDate: Number(queryParams.startDate),
          endDate: Number(queryParams.endDate),
        },
      };
      console.log(demographics);
      dispatch({ type: 'UPDATE_DEMOGRAPHICS', demographics });
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

export const getConfig = id => (dispatch) => {
};

