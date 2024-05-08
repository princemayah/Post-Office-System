module.exports = function(req, res, connection) {
    var jsonString = '';
      try{ 
        req.on('data', function (data) {    
          jsonString += data;               
        });

        req.on('end', function () {        
          parsedData = JSON.parse(jsonString);  
          if (!parsedData.employees_id) {  
            res.end(JSON.stringify({ message: 'Invalid employee id or does not exist' })); 
            return;
          };
        let query = `SELECT * FROM workhours 
                    WHERE employees_id = ? 
                    AND working_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY) AND CURRENT_DATE()`;
        let params = [parsedData.employees_id];
        connection.query(query, params, (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify(result));
        });
    });
    }
    catch(error){ 
        console.log(error); 
    }
}
