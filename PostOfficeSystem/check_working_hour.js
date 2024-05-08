module.exports = function(req, res, connection, employeeId) {
    let query = `SELECT * FROM workhours 
                 WHERE employees_id = ? 
                 AND working_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 33 DAY) AND CURRENT_DATE()`;
    let params = [employeeId];
    connection.query(query, params, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
};
