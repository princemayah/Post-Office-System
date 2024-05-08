function executeQuery(connection, query, params) { //Since connection.query doesn't return a promise, we have to wrap it in a promise
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


module.exports = function getLocations(req, res, connection) {
    const query = 'SELECT lname FROM location';
    executeQuery(connection, query)
      .then(result => {
          res.end(JSON.stringify(result));
      })
      .catch(error => {
          res.status(500).end(JSON.stringify({message: "Error fetching locations", error: error}));
      });
  }