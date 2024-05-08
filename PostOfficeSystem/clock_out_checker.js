const checkShouldClockOut = (req, res, connection, employeeId) => {
  // Assuming you don't need to parse JSON data for this route, as employeeId is obtained differently
  const query = `
      SELECT 
          employees_id, 
          in_hour,
          TIMESTAMPDIFF(MINUTE, in_hour, NOW()) AS minutes_worked
      FROM 
          workhours 
      WHERE 
          employees_id = ? AND 
          working_date = CURDATE() AND 
          out_hour IS NULL AND
          needs_to_clock_out = ?
  `;

  connection.query(query, [employeeId,1], (err, results) => {
      if (err) {
          console.error(err);
          res.end(JSON.stringify({ message: 'An error occurred while checking clock out status.' }));
          return;
      }

      const shouldClockOut = results.length > 0 && results[0].minutes_worked >= 465;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ shouldClockOut }));
  });
};

module.exports = {
  checkShouldClockOut
};