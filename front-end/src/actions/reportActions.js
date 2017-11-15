import React from 'react';
import '../index.css';

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: 'test',
    lastName: 'test',
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33 ? 'complicated' : 'single',
  };
};

export const makeData = len => (dispatch) => {
  let leng = len;
  dispatch(range(leng).map(d => ({
    ...newPerson(),
    children: range(10).map(newPerson),
  })));
};
