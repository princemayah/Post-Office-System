function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
};

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

async function doesExist(connection, query, params) { //This function checks if the randomly generated ID or inputted information already exists in the database
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) reject(err);
            resolve(result.length === 0 ? false : true);
        });
    });
}

module.exports = function (req,res,connection){
    try{
        var jsonString = "";
        req.on("data", function(data){
            jsonString += data;
        });

        req.on("end", async function(){
            parsedData = JSON.parse(jsonString);
            let query;
            let params;
            let result;
            if(!parsedData.weight || !parsedData.street_address_from || !parsedData.city_from || !parsedData.state_from || !parsedData.zip_from || !parsedData.street_address_to 
                || !parsedData.city_to || !parsedData.state_to || !parsedData.zip_to || !parsedData.location_name|| !parsedData.receive_f_name || !parsedData.receive_l_name
                || !parsedData.send_f_name || !parsedData.send_l_name){
                res.end(JSON.stringify({message: "Please enter all required fields"}));
                return;
            }

            let exists = true;
            let packages_id; //or tracking_id, they are the same check if tracking_id already exists

            while(exists) { 
                packages_id = getRandom(9); //tracking number is 10 digits long
                exists = await doesExist(connection, 'SELECT packages_id FROM packages WHERE packages_id = ?', [packages_id]);
            }

            exists = true;
            let address_from_id; //Get the address id of the user from the token
            // query = 'SELECT address_id FROM customers WHERE customers_id = ?'; //This part applies to customers because the address is linked with their token
            // params = [customerId];
            // result = await executeQuery(connection, query, params);
            // address_from_id = result[0].address_id;

            exists = true;   
            while(exists) {
                query = 'SELECT address_id FROM address WHERE street_address = ? AND city = ? AND state = ? AND zip = ?'
                params = [parsedData.street_address_from, parsedData.city_from, parsedData.state_from, parsedData.zip_from]
                exists = await doesExist(connection, query, params);
                if(exists === true){
                    result = await executeQuery(connection, query, params);
                    address_from_id = result[0].address_id;
                    break;
                }
                else{ //If the address_id doesn't exist, you create one and insert it into the database
                    address_from_id = getRandom(3); //Address id is 3 digits long
                    query = 'INSERT INTO address(address_id, street_address, state, city, zip) VALUES(?, ?, ?, ?, ?);';
                    params = [address_from_id, parsedData.street_address_from, parsedData.state_from, parsedData.city_from, parsedData.zip_from];
                    await executeQuery(connection, query, params);
                }
            }


            let address_to_id; //Check if address_to already exists, if it does, get the address_id, else, create a new one
            
            exists = true;
            while(exists) {
                query = 'SELECT address_id FROM address WHERE street_address = ? AND city = ? AND state = ? AND zip = ?'
                params = [parsedData.street_address_to, parsedData.city_to, parsedData.state_to, parsedData.zip_to]
                exists = await doesExist(connection, query, params);
                if(exists === true){
                    result = await executeQuery(connection, query, params);
                    address_to_id = result[0].address_id;
                    break;
                }
                else{
                    address_to_id = getRandom(3); //Address id is 3 digits long
                    query = 'INSERT INTO address(address_id, street_address, state, city, zip) VALUES(?, ?, ?, ?, ?);';
                    params = [address_to_id, parsedData.street_address_to, parsedData.state_to, parsedData.city_to, parsedData.zip_to];
                    await executeQuery(connection, query, params);
                }
            }

            let location_id; //Check if location already exists, if it does, get the location_id, else, let user choose again
            exists = true;
            while(exists) {
                exists = await doesExist(connection, 'SELECT lname FROM location WHERE lname = ?', [parsedData.location_name]);
                if(exists === true){
                    result = await executeQuery(connection, 'SELECT location_id FROM location WHERE lname = ?', [parsedData.location_name]);
                    console.log(result)
                    location_id = result[0].location_id;
                    console.log("location_id: ", location_id);
                    break;
                }
                else{
                    res.end(JSON.stringify({message: "Location does not exist, please enter or choose again"}));
                    return;
                }
            }

            let price = parsedData.weight * 5; //Price is $5 per pound

            //Now we skip this because sender first name and last name is entered manually
            // let sender_f_name;
            // let sender_l_name;
            // const query0 = 'SELECT Fname, Lname FROM customers WHERE customers_id = ?';
            // const params0 = [customerId];
            // result = await executeQuery(connection, query0, params0);
            // sender_f_name = result[0].Fname;
            // sender_l_name = result[0].Lname;

            //Now inserting the data after checking. No need to check for customer_id because the customer already logged in. Not add a store.
            if (parsedData.send_email && pasedData.receive_email){
                const query1 = `INSERT INTO packages(weight, price, packages_id, customers_send_id, address_from_id, address_to_id, location_id, send_f_name, send_l_name,
                                receive_f_name, receive_l_name, package_status, send_email, receive_email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`; 
                const params1 = [parsedData.weight, price, packages_id, null, address_from_id, address_to_id, location_id, parsedData.send_f_name, parsedData.send_l_name, 
                                parsedData.receive_f_name, parsedData.receive_l_name , "just created", parsedData.send_email, parsedData.receive_email];
                }
            else if(!parsedData.send_email && !parsedData.receive_email){
                const query1 = `INSERT INTO packages(weight, price, packages_id, customers_send_id, address_from_id, address_to_id, location_id, send_f_name, send_l_name,
                    receive_f_name, receive_l_name, package_status, send_email, receive_email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`; 
                const params1 = [parsedData.weight, price, packages_id, null, address_from_id, address_to_id, location_id, parsedData.send_f_name, parsedData.send_l_name, 
                    parsedData.receive_f_name, parsedData.receive_l_name , "just created", null, null];
            }
            else if(parsedData.send_email && !parsedData.receive_email){
                const query1 = `INSERT INTO packages(weight, price, packages_id, customers_send_id, address_from_id, address_to_id, location_id, send_f_name, send_l_name,
                    receive_f_name, receive_l_name, package_status, send_email, receive_email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`; 
                const params1 = [parsedData.weight, price, packages_id, null, address_from_id, address_to_id, location_id, parsedData.send_f_name, parsedData.send_l_name, 
                    parsedData.receive_f_name, parsedData.receive_l_name , "just created", parsedData.send_email, null];
            }
            else if(!parsedData.send_email && parsedData.receive_email){
                const query1 = `INSERT INTO packages(weight, price, packages_id, customers_send_id, address_from_id, address_to_id, location_id, send_f_name, send_l_name,
                    receive_f_name, receive_l_name, package_status, send_email, receive_email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`; 
                const params1 = [parsedData.weight, price, packages_id, null, address_from_id, address_to_id, location_id, parsedData.send_f_name, parsedData.send_l_name, 
                    parsedData.receive_f_name, parsedData.receive_l_name , "just created", null, parsedData.receive_email];
            }

            await executeQuery(connection, query1, params1);

            res.end(JSON.stringify({message: "Package created"}));
        });
    }
    catch(error){
        console.log(error);
    };
}