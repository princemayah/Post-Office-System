const jwt = require('jsonwebtoken');
const SECRET_KEY = '3380team3'; // This is the secret key used to sign the JWT (important)

module.exports = function(req, res, connection) {
    let jsonString = '';

    req.on('data', function (data) {
        jsonString += data;
    });

    req.on('end', function () {
        try {
            const parsedData = JSON.parse(jsonString);
            if (!parsedData.username || !parsedData.password) {
                res.end(JSON.stringify({ message: 'Invalid input' }));
                return;
            }

            const query = `SELECT * FROM employees WHERE e_username = ? AND e_password = ?`;
            const params = [parsedData.username, parsedData.password];

            connection.query(query, params, (err, result) => {
                if (err) {
                    console.error(err);
                    res.end(JSON.stringify({ message: 'An error occurred while logging in.' }));
                    return;
                }
            
                if (result.length > 0) {
                    const employees_id = result[0].employees_id;
                    const token = jwt.sign({ employees_id }, SECRET_KEY, { expiresIn: '2h' });
                    res.setHeader('Authorization', `Bearer ${token}`);
                    res.end(JSON.stringify({ message: 'Login successful', status: true, token, role: result[0].e_role }));
                } else {
                    res.end(JSON.stringify({ message: 'Login failed, check your username and password again.' }));
                }
            });
        } catch (error) {
            console.error(error);
            // Send a generic error message to the client
            res.end(JSON.stringify({ message: 'An error occurred.' }));
        }
    });
};