
const http = require('http');
const fs = require('fs');
require('dotenv').config();
const connection = require('./mysql_connection.js')
const c_login = require('./c_login.js');
const c_signup = require('./c_signup.js');
const c_login_page = fs.readFileSync('./frontend/src/customer_handle/loginpage.jsx');
const jwt = require('jsonwebtoken');
const customer_packages = require('./customer_packages.js');
const delete_packages = require('./delete_packages.js')
const main_page = fs.readFileSync('./frontend/src/main_page/mainpage.jsx');
const c_mainpage = fs.readFileSync('./frontend/src/main_page/c_mainpage.jsx'); //Files like this doesnt have to be included since they are handled in App.js already
const c_packages = fs.readFileSync('./frontend/src/customer_handle/customer_packages.jsx');
const e_login = require('./e_login.js');
const c_create_package = require('./c_create_package.js');
const e_login_page = fs.readFileSync('./frontend/src/employee_handle/e_loginpage.jsx');
const e_mainpage_assign = require('./e_mainpage_assign.js');
const c_create_package_page = fs.readFileSync('./frontend/src/customer_handle/c_create_package_page.jsx');
const general_create_package = require('./general_create_package.js');
const tracking_package = require('./tracking.js');
const e_signup = require('./e_signup.js');
const all_packages = require('./all_packages.js');
const employee_in_hour = require('./employee_in_hour.js');
const employee_out_hour = require('./employee_out_hour.js');
const employee_check_working_hours = require('./check_working_hours.js');
const manager_check_working_hours = require('./manager_working_hours.js');
const all_employee = require('./all_employee.js')
const delete_employee = require('./delete_employee.js');
const sendNotificationEmail = require('./email_handle.js')
const getLocations = require('./get_location.js')
const { checkShouldClockOut } = require('./clock_out_checker.js');


// connect to the MySQL database
//connection.connect((error) => {
//if (error) {
 // console.error('Error connecting to MySQL database:', error);
//} else {
 // console.log('Connected to MySQL database!');
//}
//});
// close the MySQL connection
// connection.end();

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization'); //This allows request to be sent from react called CORS

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let customerId = null;
  let employeeId = null;

  const SECRET_KEY = '3380team3' //This is the secret key used to sign the JWT (important)

  const incomingToken = req.headers.authorization?.split(' ')[1]; //This checks for any incoming tokens
  if (incomingToken) {
    try {
      let decoded = jwt.verify(incomingToken, SECRET_KEY);
      if(decoded.customers_id){
        customerId = decoded.customers_id;//Store the customers_id in the token into the customerID variable
        // Now use customer_id in your SQL queries to check for packages, etc.
       }
      else if (decoded.employees_id) {
        employeeId = decoded.employees_id;
      } 
    } catch (err) {
      res.end('Invalid or expired token');
    }
  }


  if (req.url === "/customer_login"){ //This checks if the request is for the customer_login page
    if(req.method === "POST"){
      c_login(req,res,connection);
    }

    else {
      res.end(c_login_page);
    }
  }

  else if (req.url === "/customer_signup"){ //This checks if the request is for the customer_signup page
    if(req.method === "POST"){
      c_signup(req,res,connection);
    }
  }

  else if (req.url.startsWith("/customer_packages")) {
    customer_packages(req, res, connection, customerId);
  }

  else if (req.method == "DELETE" && req.url.startsWith("/delete_packages/")) {
    delete_packages(req, res, connection);
  }

  else if (req.url === "/customer_create_package"){
    if(req.method === "POST"){
      c_create_package(req,res,connection,customerId);
    }
    else {
      res.end(c_create_package_page);
    }
  }

  else if (req.url === '/get_locations' && req.method === 'GET') {
    getLocations(req, res, connection);
  }

  else if (req.url === "/customer_mainpage"){
    res.end(c_mainpage);
  }

  else if (req.url === "/employee_login"){
    if(req.method === "POST"){
      e_login(req,res,connection);
    }
    else{
      res.end(e_login_page);
    }
  }

  else if (req.url === "/employee_signup"){
    if(req.method === "POST"){
      e_signup(req,res,connection);
    }
  }

  else if (req.url === "/employee_mainpage"){
    if (req.method === "POST"){
      e_mainpage_assign(req,res,connection, employeeId);
      sendNotificationEmail()
    }
  }

  else if(req.url === "/check_clock_out" && req.method == "GET") {
    checkShouldClockOut(req, res, connection, employeeId);
  }


  else if (req.url === "/create_package"){
    if(req.method === "POST"){
      general_create_package(req,res,connection);
    }
  }

  else if (req.url === "/tracking_package"){
    tracking_package(req,res,connection);
  }

  else if(req.url.startsWith("/all_packages")){
    all_packages(req,res,connection);
  }

  else if(req.url === "/in_hour"){
    employee_in_hour(req,res,connection, employeeId);
  }

  else if(req.url === "/out_hour"){
    employee_out_hour(req,res,connection, employeeId);
  }

  else if(req.url === "/employee_check_working_hours"){
    employee_check_working_hours(req,res,connection, employeeId);
  }

  else if(req.url === "/manager_check_working_hours"){
    if (req.method === "POST"){
      manager_check_working_hours(req,res,connection);
    }
  }

  else if(req.url.startsWith("/all_employee")) {
    all_employee(req, res, connection);
  }
  
  else if(req.url.startsWith("/delete_employee/") && req.method == "DELETE"){
    delete_employee(req,res,connection)
  }

  else{
    res.end(main_page);
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
