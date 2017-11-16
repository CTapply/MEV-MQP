const initialVisualizationState = {
  meType: [{ name: 'Medication Error Type', size: 1 }],
  product: [{ name: 'Products', size: 1 }],
  stage: [{ name: 'Stage', size: 1 }],
  cause: [{ name: 'Cause', size: 1 }],
};

/**
 * Reducer that listens and handles all Redux state operations
 * for the TreeMap Visualization
 */
export default (state = initialVisualizationState, action = {}) => {
  switch (action.type) {
    case 'UPDATE_VIS':
      let returnObject = { meType: [], product: [], stage: [], cause: [] };
      if (action.visData.meType.length === 0) {
        returnObject.meType = [{ name: 'Nothing Found', size: 0 }];
      } else {
        returnObject.meType = action.visData.meType;
      }
      if (action.visData.product.length === 0) {
        returnObject.product = [{ name: 'Nothing Found', size: 0 }];
      } else {
        returnObject.product = action.visData.product;
      }
      if (action.visData.stage.length === 0) {
        returnObject.stage = [{ name: 'Nothing Found', size: 0 }];
      } else {
        returnObject.stage = action.visData.stage;
      }
      if (action.visData.cause.length === 0) {
        returnObject.cause = [{ name: 'Nothing Found', size: 0 }];
      } else {
        returnObject.cause = action.visData.cause;
      }
      console.log('returnObject', returnObject);
      return Object.assign({}, state, returnObject);
    default: return state;
  }
};
