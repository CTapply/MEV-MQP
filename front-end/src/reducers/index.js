import { combineReducers } from 'redux';
import demographic from './demographicReducer';
import filters from './filterReducer';
import mainVisualization from './visualizationReducer';
import timeline from './timelineReducer';

/**
 * Redux Reducer that combines all of the other reducers to build the Redux State
 */
export default combineReducers({ demographic, filters, mainVisualization, timeline });
