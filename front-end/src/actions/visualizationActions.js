import _ from 'lodash';

const ageAdapter = (row) => {
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

const sexAdapter = row => (row.sex ? row.sex : 'UNK');
const countryAdapter = row => (row.occr_country ? row.occr_country : 'UNK');

export const getData = queryParams => (dispatch) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      table: 'demo',
      query: 'sex',
    }),
  };

  console.log(queryParams);

  fetch('http://localhost:3001/getdata', fetchData)
    .then(response => response.json())
    .then((things) => {
      console.log(things.rows);
      dispatch({ type: 'UPDATE_DATA', things: JSON.stringify(things.rows, null, 2) });

      const demographics = {
        sex: _(things.rows).map(sexAdapter).countBy().value(),
        age: _(things.rows).map(ageAdapter).countBy(Math.floor).value(),
        location: _(things.rows).map(countryAdapter).countBy().value(),
        date: _(things.rows).map('rept_dt').countBy().value(),
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

