
module.exports = function(req, res, connection, employeeId) {
    let jsonString = '';
    
    req.on('data', function(data) {
        jsonString += data;
    });

    req.on('end', function() {
        try {
            const parsedData = JSON.parse(jsonString);

            if (!parsedData.trackingNumber || !parsedData.packageStatus) {
                res.end(JSON.stringify({ message: 'Invalid input' }));
                return;
            }

            const query = 'UPDATE packages SET employees_handle_id = ?, package_status = ? WHERE packages_id = ?';
            const params = [employeeId, parsedData.packageStatus, parsedData.trackingNumber];
            
            connection.query(query, params, (err, result) => {
                if (err) {
                    console.log('Database Error:', err);
                    res.end(JSON.stringify({ message: 'Database error occurred.' }));
                    return;
                }
                res.end(JSON.stringify({message : `Assigned package ${parsedData.trackingNumber} to employee ${employeeId}. Status: ${parsedData.packageStatus}`}));
            });
            
        } catch (error) {
            console.log(error);
            res.end(JSON.stringify({ message: 'An error occurred.' }));
        }
    });

};
