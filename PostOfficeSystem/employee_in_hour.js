module.exports = function(req, res, connection, employeeId) {
    const moment = require('moment-timezone');
    const currentDate = moment.tz("America/Chicago").format('YYYY-MM-DD');

    // Check for existing clock-in record first
    let checkQuery = 'SELECT * FROM workhours WHERE employees_id = ? AND working_date = ? AND out_hour IS NULL';
    let checkParams = [employeeId, currentDate];
    
    connection.query(checkQuery, checkParams, (checkErr, checkResult) => {
        if (checkErr) {
            // Handle the error appropriately
            console.error(checkErr);
            res.end(JSON.stringify({ message: 'Error checking existing clock-in status' }));
            return;
        }

        if (checkResult.length > 0) {
            // Employee has already clocked in
            res.end(JSON.stringify({ message: 'Already clocked in' }));
        } else {
            // No clock-in record exists, proceed to insert
            const currentTime = moment.tz("America/Chicago").format('HH:mm:ss');
            let insertQuery = 'INSERT INTO workhours(employees_id, working_date, in_hour, needs_to_clock_out) VALUES(?, ?, ?, ?)';
            let insertParams = [employeeId, currentDate, currentTime, 0];
            
            connection.query(insertQuery, insertParams, (insertErr, insertResult) => {
                if (insertErr) {
                    // Handle the error appropriately
                    console.error(insertErr);
                    res.end(JSON.stringify({ message: 'There is a problem. Please contact your manager' }));
                    return;
                }
                
                if (insertResult.affectedRows > 0) {
                    res.end(JSON.stringify({ message: 'Employee in hour recorded' }));
                } else {
                    res.end(JSON.stringify({ message: 'Failed to record clock-in' }));
                }
            });
        }
    });
};
