module.exports = function(req, res, connection, employeeId) {
    let query = `SELECT * FROM workhours WHERE employees_id = ?`;
    let params = [employeeId];
    
    connection.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            res.end(JSON.stringify({ message: 'Error querying the database' }));
        } else {
            res.end(JSON.stringify(result));
        }
    });
};