// delete_employee.js
module.exports = function(req, res, connection) {
  // Assuming you will receive the employee ID in the URL
  const employeeId = req.url.split('/')[2];

  const query = 'DELETE FROM employees WHERE employees_id = ?';
  connection.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting the employee: ', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error deleting the employee' }));
      return;
    }
    if (result.affectedRows === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Employee not found' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Employee deleted successfully' }));
  });
};
