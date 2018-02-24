import { filterData } from './filterActions';

/**
 * Gets the data to build the timeline for the entire database
 */
export const getEntireTimeline = () => (dispatch) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch('http://localhost:3001/gettimelinedata', fetchData)
    .then(response => response.json())
    .then((allReports) => {
      console.log('Got timeline');
      dispatch({ type: 'SET_ENTIRE_TIMELINE', entireTimelineData: allReports });
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

/**
 * Sets the filter with the given dates then filters all data.
 */
export const setSelectedDate = selectedDates => (dispatch) => {
  dispatch({ type: 'SET_DATE_RANGE', init_fda_dt: { start: selectedDates.startDate, end: selectedDates.endDate } });
  dispatch(filterData());
};

export const setTimelineMinimizedToggle = toggle =>
  dispatch => dispatch({ type: 'TOGGLE_TIMELINE_MINIMIZED', timelineMinimized: toggle });
