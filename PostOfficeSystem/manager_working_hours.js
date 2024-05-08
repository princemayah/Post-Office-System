module.exports = function(req, res, connection) {
  var jsonString = '';
  try { 
      req.on('data', function (data) {    
          jsonString += data;               
      });

      req.on('end', function () {        
          const parsedData = JSON.parse(jsonString);
          if (!parsedData.employees_id) {  
              res.end(JSON.stringify({ message: 'Invalid employee id or does not exist' }));
              return;
          };

          // First, get the work hours
          let queryWorkHours = `SELECT w.*, e.EFName, e.ELName FROM workhours w
                                INNER JOIN employees e ON w.employees_id = e.employees_id
                                WHERE w.employees_id = ?`;
          let paramsWorkHours = [parsedData.employees_id];

          connection.query(queryWorkHours, paramsWorkHours, (err, workHoursResult) => {
              if (err) {
                  console.error(err);
                  res.end(JSON.stringify({ message: 'Error querying the database for work hours' }));
                  return;
              }

              // Second, get the total hours sum
              let queryTotalHours = `SELECT SUM(total_hour) AS totalSum FROM workhours
                                     WHERE employees_id = ?`;
              connection.query(queryTotalHours, paramsWorkHours, (err, totalHoursResult) => {
                  if (err) {
                      console.error(err);
                      res.end(JSON.stringify({ message: 'Error querying the database for total hours' }));
                      return;
                  }

                  // Combine the results and send them back
                  const responseData = {
                      workHours: workHoursResult,
                      totalHoursSum: totalHoursResult[0].totalSum
                  };

                  res.end(JSON.stringify(responseData));
              });
          });
      });
  }
  catch(error) { 
      console.log(error); 
      res.end(JSON.stringify({ message: 'An error occurred' }));
  }
}