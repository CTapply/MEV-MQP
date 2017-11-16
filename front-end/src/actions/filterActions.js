import { getDemographicData } from './demographicActions';
import { getVisData } from './visualizationActions';

/**
 * Queries the Database with the current Filters in the Redux State
 */
export const filterData = () => (dispatch, getState) => {
  const postBody = {
    ...getState().filters,
  };

  console.log('Filtering the Data');

  // Dispatch the new Filters to the appropriate Actions to get newly filtered data.
  dispatch(getDemographicData(postBody));
  dispatch(getVisData(postBody));
};

export const asd = () => 123;
