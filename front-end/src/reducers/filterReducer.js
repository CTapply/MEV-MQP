const initialFilterState = {
  REPT_DT: {
    start: 20170101,
    end: 20170101,
  },
  sex: [],
  occr_country: [],
  age: [],
  occp_cod: [],
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the Filters
 */
export default (state = initialFilterState, action = {}) => {
  switch (action.type) {
    case 'SET_DATE_RANGE':
      return Object.assign({}, state, { REPT_DT: action.REPT_DT });
    case 'SET_SEX':
      return Object.assign({}, state, { sex: action.sex });
    case 'SET_LOCATION':
      return Object.assign({}, state, { occr_country: action.occr_country });
    case 'SET_AGE':
      return Object.assign({}, state, { age: action.age });
    case 'SET_OCCUPATION':
      return Object.assign({}, state, { occp_cod: action.occp_cod });
    default: return state;
  }
};
