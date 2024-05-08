function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
};

async function doesExist(connection, query, params) { //This function checks if the randomly generated ID or inputted information already exists in the database
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) reject(err);
            resolve(result.length === 0 ? false : true);
        });
    });
}

function executeQuery(connection, query, params) { //Since connection.query doesn't return a promise, we have to wrap it in a promise
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


//Have to use async function because we have to wait for the database to return a result. Otherwise the while loop will not wait and run forever.
module.exports = async function(req,res,connection){
    try{
        var jsonString = "";
        req.on("data", function(data){
            jsonString += data;
        });

        req.on("end", async function(){
            parsedData = JSON.parse(jsonString);
            if(!parsedData.e_username || !parsedData.e_password || !parsedData.EFname || !parsedData.ELname 
                || !parsedData.employees_ssn || !parsedData.location_name || !parsedData.e_role){
                res.end(JSON.stringify({message: "Please enter all required fields"}));
                return;
            }

            let exists = true;
            let employees_id;
            while(exists) {  //Check for existing employees_id
                employees_id = getRandom(7);
                exists = await doesExist(connection, 'SELECT employees_id FROM employees WHERE employees_id = ?', [employees_id]);
            }
           
            while(exists) { //Check for existing username
                exists = await doesExist(connection, 'SELECT e_username FROM employees WHERE e_username = ?', [parsedData.e_username]);
                if(exists === true){
                    res.end(JSON.stringify({message: "Username already exists"}));
                    return;
                }
            }

            while(exists) {
                exists = await doesExist(connection, 'SELECT employees_ssn FROM employees WHERE employees_ssn = ?', [parsedData.employees_ssn]);
                if(exists === true){
                    res.end(JSON.stringify({message: "SSN already exists"}));
                    return;
                }
            }

            const query0 = `SELECT location_id FROM location WHERE lname = ?`;
            const params0 = [parsedData.location_name];

            const result = await executeQuery(connection, query0, params0); //Get location_id from location name in location table
            if(result.length === 0){
                res.end(JSON.stringify({message: "Location does not exist"}));
                return;
            }
            else{
                location_id = result[0].location_id;
            }


            //Insert data without address_id due to CONSTRAINTS FOREIGN KEY
            const query1 = `INSERT INTO employees(employees_id, EFname, ELname, e_username, e_password, employees_ssn, location_id, e_role) VALUES(?, ?, ?, ?, ?, ?, ? , ?);`; 
            const params1 = [employees_id, parsedData.EFname, parsedData.ELname, parsedData.e_username, parsedData.e_password, parsedData.employees_ssn, location_id, parsedData.e_role];

            await executeQuery(connection, query1, params1);

            res.end(JSON.stringify({message: "Employee's information has been created successfully"}));
        });
    }
    catch(error){
        console.log(error);
    };
};