import { combineReducers } from 'redux';
import demographic from './demographicReducer';
import filters from './filterReducer';
import mainVisualization from './visualizationReducer';
import timeline from './timelineReducer';

export default { demographic, filters, mainVisualization, timeline };
