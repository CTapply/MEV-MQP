const initialDemographicState = {
  sex: [],
  age: [],
  location: [],
  occp_cod: [],
  demographicsMinimized: false,
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the Demographics
 */
export default (state = initialDemographicState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_DEMOGRAPHICS':
      return Object.assign({}, state, { ...action.demographics });
    case 'TOGGLE_DEMOGRAPHICS_MINIMIZED':
      return Object.assign({}, state, { demographicsMinimized: action.demographicsMinimized });
    default: return state;
  }
};
