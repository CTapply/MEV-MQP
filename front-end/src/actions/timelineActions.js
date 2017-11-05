import { filterData } from './filterActions';

export const setSelectedTimeline = () => (dispatch) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('grabbing timeline data');

  fetch('http://localhost:3001/gettimelinedata', fetchData)
    .then(response => response.json())
    .then((allReports) => {
      // console.log(allReports);
      dispatch({ type: 'SET_ENTIRE_TIMELINE', entireTimelineData: allReports });
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

export const setSelectedDate = selectedDates => (dispatch) => {
  dispatch({ type: 'SET_DATE_RANGE', REPT_DT: { start: selectedDates.startDate, end: selectedDates.endDate } });
  console.log('Setting Date Range');
  dispatch(filterData());
};
