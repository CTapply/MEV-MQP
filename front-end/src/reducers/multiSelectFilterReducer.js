const initialFilterState = {
  currentlySelecting: false,
  startingFilters: {},
  loadingVisData: false,
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the Filters
 */
export default (state = initialFilterState, action = {}) => {
  switch (action.type) {
    case 'SET_CURRENTLY_SELECTING':
      return Object.assign({}, state, { currentlySelecting: action.currentlySelecting });
    case 'SET_CURRENTLY_SELECTING_FILTERS':
      return Object.assign({}, state, { startingFilters: action.startingFilters });
    case 'SET_VIS_LOADING':
      return Object.assign({}, state, { loadingVisData: action.loadingVisData });
    default: return state;
  }
};
