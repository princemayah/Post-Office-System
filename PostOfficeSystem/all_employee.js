module.exports = function(req, res, connection) {
  // Parse the URL and the query string
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let query = `SELECT employees.*, COALESCE(COUNT(packages.employees_handle_id), 0) as total_packages
                FROM employees
                LEFT JOIN packages ON employees.employees_id = packages.employees_handle_id`;
  let queryParams = [];
  let conditions = [];

  // Fetch pagination parameters from the query string
  const page = parseInt(reqUrl.searchParams.get('page'), 10) || 1;
  const limit = parseInt(reqUrl.searchParams.get('limit'), 10) || 20;
  const offset = (page - 1) * limit;

  // Check if the 'location_id' query parameter is provided and add it to the conditions
  if (reqUrl.searchParams.has('location_id')) {
      conditions.push('location_id = ?');
      queryParams.push(reqUrl.searchParams.get('location_id'));
  }

  // Check if the 'e_role' query parameter is provided and add it to the conditions
  if (reqUrl.searchParams.has('e_role')) {
      conditions.push('e_role = ?');
      queryParams.push(reqUrl.searchParams.get('e_role'));
  }

  // Add the WHERE conditions to the query if any conditions are present
  if (conditions.length > 0) {
    query += ` GROUP BY employees.employees_id HAVING ${conditions.join(' AND ')}`;
} else {
    query += ` GROUP BY employees.employees_id`;
}

  // Add a limit and offset to the query to paginate results
  query += ' LIMIT ?, ?';
  queryParams.push(offset, limit);

  // Execute the query with the provided conditions, limit, and offset
  connection.query(query, queryParams, (err, result) => {
      if (err) {
          console.error('Error fetching the employees: ', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error fetching the employees' }));
          return;
      }
      
      if (result.length > 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
      } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'No employees found' }));
      }
  });
};