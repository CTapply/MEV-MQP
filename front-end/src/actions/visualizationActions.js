/**
 * Gets the data used for the TreeMap visualization with the given filter parameters
 * @param {object} queryParams 
 */
export const getVisData = queryParams => (dispatch) => {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...queryParams,
    }),
  };

  fetch('http://localhost:3001/getvis', fetchData)
    .then(response => response.json())
    .then((allReports) => {
      const visData = allReports;
      console.log(visData);
      dispatch({ type: 'UPDATE_VIS', visData });
    })
    .catch((err) => {
      console.error.bind(err);
    });
};

export const getConfig = id => (dispatch) => {

};

