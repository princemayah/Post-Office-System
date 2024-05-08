module.exports = function(req,res,connection){
    var jsonString = '';
    try{ //This try-catch block is used to catch any errors that may occur
      req.on('data', function (data) {    //This takes the data from the client
        jsonString += data;               //and stores it in a string
      });

      req.on('end', function () {         //This is called when the client is done sending data
        parsedData = JSON.parse(jsonString);  //This parses the string into a JSON object
        if (!parsedData.packages_id) {  //This checks if the JSON object has the required fields
          res.end(JSON.stringify({ message: "Please enter the correct tracking number" })); 
          return;
        };
        const query = `SELECT * FROM trackinghistory WHERE tracking_number = ?`; //This is the query to be sent to the database
        const params = [parsedData.packages_id]; //This is the parameters to be sent to the database. They will replace the '?'s in the query

        connection.query(query, params, (err, result) => { //This sends the query to the database
          if (err) throw err;
      
          if (result.length > 0) { //This checks if the query returned any results
            res.end(JSON.stringify(result)); //This sends a response to the client and convert the JSON object to a string
          }
          else {
            res.end(JSON.stringify({ message: "Tracking number does not exist" }));
          } 
        });
      });
    }
    catch(error){ //This catches any errors that may occur
      console.log(error); 
    }
}