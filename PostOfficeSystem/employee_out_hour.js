module.exports = function(req, res, connection, employeeId) {
   const moment = require('moment-timezone');
   const currentDate = moment.tz("America/Chicago").format('YYYY-MM-DD');

   const currentTime = moment.tz("America/Chicago").format('HH:mm:ss');

    // First, get the in_hour for the employee for today
    let inHourQuery = 'SELECT in_hour FROM workhours WHERE employees_id = ? AND working_date = ?';
    let inHourParams = [employeeId, currentDate];
    
    connection.query(inHourQuery, inHourParams, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            let inHour = result[result.length - 1].in_hour;


            // Then perform the update
            let updateQuery = `
                UPDATE workhours
                SET out_hour = ?, 
                    total_hour = TIME_TO_SEC(TIMEDIFF(?, ?)) / 3600
                WHERE employees_id = ? AND working_date = ? AND in_hour = ?;
            `;

            let updateParams = [currentTime, currentTime, inHour, employeeId, currentDate, inHour];

            connection.query(updateQuery, updateParams, (err, result) => {
                if (err) throw err;
                if (result.affectedRows > 0) {
                    res.end(JSON.stringify({ message: 'Employee out hour recorded' }));
                } else {
                    res.end(JSON.stringify({ message: 'You have not logged your in hour today. Contact manager for more supports' }));
                }
            });
        } else {
            res.end(JSON.stringify({ message: 'You have not logged your in hour today. Contact manager for more supports' }));
        }
    });
};
