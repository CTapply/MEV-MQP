export const getUserBins = userID => () => {
    const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userID,
    }),
    };
    return fetch('http://localhost:3001/getuserbins', fetchData)
    .then(response => response.json())
    .then((bins) => {
        return bins.rows;
    })
    .catch((err) => {
        console.error.bind(err);
    });
};

export const createUserBin = (userID, binName) => () => {
    const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userID,
        binName,
    }),
    };
    fetch('http://localhost:3001/createuserbin', fetchData)
};