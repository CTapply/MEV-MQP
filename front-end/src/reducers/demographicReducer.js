const initialDemographicState = {
  sex: [],
  age: [],
  location: [],
  selectedDates: {
    startDate: 20170101,
    endDate: 20170701,
  },
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the Demographics
 */
export default (state = initialDemographicState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_DEMOGRAPHICS':
      return Object.assign({}, state, { ...action.demographics });
    default: return state;
  }
};
