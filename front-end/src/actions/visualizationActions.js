import _ from 'lodash';
import { filterData } from './filterActions';

/**
 * Gets the data used for the TreeMap visualization with the given filter parameters
 * @param {object} queryParams
 */
export const getVisData = queryParams => (dispatch) => {
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

  return fetch(`${process.env.REACT_APP_NODE_SERVER}/getvis`, fetchData)
    .then(response => response.json())
    .then((allReports) => {
      const visData = {
        cause: _.reverse(_.sortBy(allReports.cause, 'size')),
        meType: _.reverse(_.sortBy(allReports.meType, 'size')),
        product: _.reverse(_.sortBy(allReports.product, 'size')).slice(0, 20),
        stage: _.reverse(_.sortBy(allReports.stage, 'size')),
      };

      dispatch({ type: 'UPDATE_VIS', visData });
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleMETypeFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.meType.length !== 0) {
      dispatch({ type: 'SET_METYPE', meType: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.meType.includes(filter)) {
    dispatch({ type: 'SET_METYPE', meType: getState().filters.meType.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_METYPE', meType: getState().filters.meType.concat(filter) });
    dispatch(filterData());
  }
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleProductFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.product.length !== 0) {
      dispatch({ type: 'SET_PRODUCT', product: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.product.includes(filter)) {
    dispatch({ type: 'SET_PRODUCT', product: getState().filters.product.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_PRODUCT', product: getState().filters.product.concat(filter) });
    dispatch(filterData());
  }
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleStageFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.stage.length !== 0) {
      dispatch({ type: 'SET_STAGE', stage: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.stage.includes(filter)) {
    dispatch({ type: 'SET_STAGE', stage: getState().filters.stage.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_STAGE', stage: getState().filters.stage.concat(filter) });
    dispatch(filterData());
  }
};

/**
 * Toggles the given filter item inside of the Redux State
 * @param {string} filter the item to add/remove from the filters
 */
export const toggleCauseFilter = filter => (dispatch, getState) => {
  if (filter === 'CLEAR') {
    if (getState().filters.cause.length !== 0) {
      dispatch({ type: 'SET_CAUSE', cause: [] });
      dispatch(filterData());
    }
  } else if (getState().filters.cause.includes(filter)) {
    dispatch({ type: 'SET_CAUSE', cause: getState().filters.cause.filter(item => item !== filter) });
    dispatch(filterData());
  } else {
    dispatch({ type: 'SET_CAUSE', cause: getState().filters.cause.concat(filter) });
    dispatch(filterData());
  }
};

