const initialTimelineState = {
  entireTimelineData: [{
    init_fda_dt: '20170101',
    serious: 0,
    not_serious: 0,
  }],
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the Timeline
 */
export default (state = initialTimelineState, action = {}) => {
  switch (action.type) {
    case 'SET_ENTIRE_TIMELINE':
      return Object.assign({}, state, { entireTimelineData: action.entireTimelineData });
    default: return state;
  }
};
