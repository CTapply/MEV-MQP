import _ from 'lodash';
import { getDemographicData } from './demographicActions';
import { getVisData } from './visualizationActions';

/**
 * Queries the Database with the current Filters in the Redux State
 */
export const filterData = () => (dispatch, getState) => {
  const postBody = {
    ...getState().filters,
  };

  if (!getState().multiSelectFilters.currentlySelecting) {
    dispatch({ type: 'SET_VIS_LOADING', loadingVisData: true });
    const filterPromises = [];
    // Dispatch the new Filters to the appropriate Actions to get newly filtered data.
    filterPromises.push(dispatch(getDemographicData(postBody)));
    filterPromises.push(dispatch(getVisData(postBody)));
    Promise.all(filterPromises)
      .then(() => dispatch({ type: 'SET_VIS_LOADING', loadingVisData: false }));
  }
};

export const setCurrentlySelecting = selecting => (dispatch, getState) => {
  if (selecting) {
    dispatch({ type: 'SET_CURRENTLY_SELECTING', currentlySelecting: true });
    dispatch({ type: 'SET_CURRENTLY_SELECTING_FILTERS', startingFilters: getState().filters });
  } else {
    const postBody = {
      ...getState().filters,
    };

    dispatch({ type: 'SET_CURRENTLY_SELECTING', currentlySelecting: false });

    if (!_.isEqual(getState().multiSelectFilters.startingFilters, getState().filters)) {
      // Dispatch the new Filters to the appropriate Actions to get newly filtered data.
      dispatch(getDemographicData(postBody));
      dispatch(getVisData(postBody));
    }
  }
};
