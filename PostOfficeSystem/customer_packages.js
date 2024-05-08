const url = require('url');
const querystring = require('querystring');

module.exports = function(req, res, connection, customerId) {
    // Parse the request URL
    const parsedUrl = url.parse(req.url);
    // Parse the query string
    const parsedQuery = querystring.parse(parsedUrl.query);

    // Destructure startDate and endDate from the parsed query
    const { startDate, endDate } = parsedQuery;

    let queryParams = [customerId]; // Start with customerId for the WHERE clause
    let dateRangeClause = '';

    // If both startDate and endDate are provided, add them to the query
    if (startDate && endDate) {
        dateRangeClause = ' AND th.time_stamp BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
    }

    const query = `
        SELECT
            p.packages_id, 
            CONCAT(p.send_f_name, " ", p.send_l_name) AS sender, 
            CONCAT(p.receive_f_name, " ", p.receive_l_name) AS receiver,
            CONCAT(a1.street_address, ", ", a1.city, ", ", a1.state, ", ", a1.zip) AS from_address,
            CONCAT(a2.street_address, ", ", a2.city, ", ", a2.state, ", ", a2.zip) AS to_address,
            p.package_status,
            p.employees_handle_id,
            MIN(th.time_stamp) AS package_date
        FROM packages AS p
        JOIN customers AS c ON p.customers_send_id = c.customers_id
        JOIN address AS a1 ON p.address_from_id = a1.address_id
        JOIN address AS a2 ON p.address_to_id = a2.address_id
        JOIN trackinghistory AS th ON p.packages_id = th.tracking_number
        WHERE c.customers_id = ?
        ${dateRangeClause}
        GROUP BY p.packages_id
        ORDER BY p.packages_id`;

    connection.query(query, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
            return;
        }

        if (result.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({result}));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'You currently do not have any packages' }));
        }
    });
};
