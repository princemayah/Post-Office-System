const url = require('url');
const querystring = require('querystring');

module.exports = function(req, res, connection) {
  // Parse the request URL
  const parsedUrl = url.parse(req.url);
  // Parse the query string
  const parsedQuery = querystring.parse(parsedUrl.query);

  // Destructure startDate and endDate from the parsed query
  const { startDate, endDate } = parsedQuery;

  console.log('startDate:', startDate, 'endDate:', endDate);

  let queryParams = [];
  let whereClause = '';

  if (startDate && endDate) {
    whereClause = 'WHERE th.time_stamp BETWEEN ? AND ?';
    queryParams = [startDate, endDate];
  }

  // Select your package data
  const packageQuery = `
    SELECT 
      p.packages_id, 
      CONCAT(p.send_f_name, " ", p.send_l_name) AS sender, 
      CONCAT(p.receive_f_name, " ", p.receive_l_name) AS receiver,
      CONCAT(a1.street_address, ", ", a1.city, ", ", a1.state, ", ", a1.zip) AS from_address,
      CONCAT(a2.street_address, ", ", a2.city, ", ", a2.state, ", ", a2.zip) AS to_address,
      p.package_status,
      p.employees_handle_id,
      p.price,
      MIN(th.time_stamp) AS package_date
    FROM packages AS p
    JOIN address AS a1 ON p.address_from_id = a1.address_id
    JOIN address AS a2 ON p.address_to_id = a2.address_id
    JOIN trackinghistory AS th ON p.packages_id = th.tracking_number
    ${whereClause}
    GROUP BY p.packages_id
    ORDER BY p.packages_id`;

  // Query to calculate the total cost
  const totalCostQuery = `
    SELECT 
      SUM(p.price) AS totalCost
    FROM packages AS p
    JOIN trackinghistory AS th ON p.packages_id = th.tracking_number
    ${whereClause}`;

  // Run the package data query
  connection.query(packageQuery, queryParams, (err, packages) => {
    if (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
      return;
    }

    // Run the total cost query
    connection.query(totalCostQuery, queryParams, (totalErr, totalResult) => {
      if (totalErr) {
        console.error(totalErr);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error while calculating total cost' }));
        return;
      }

      // Extract the total cost from the result
      const totalCost = totalResult[0].totalCost;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ packages, totalCost }));
    });
  });
};
