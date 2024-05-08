import React from 'react';
import { Link } from "react-router-dom";
import { Button} from 'react-bootstrap';

const EmployeeMainPage = () => {
    return (
        <div>
            <h1>Welcome Back</h1>
            <h3>To log out, just close the tab</h3>
            <div>
                <Button variant="primary" as={Link} to={"/employee_signup"}>Click here to sign up a new employee</Button>
            </div>
            <div>
                <Button variant="primary" as={Link} to={"/employee_mainpage"}>View as an employee</Button>
            </div>
            <div>
                <Button variant="primary" as={Link} to={"/manager_check_working_hours"}>Check an employee's working hours in the most recent 365 days</Button>
            </div>
	    <div>
                <Button variant="primary" as={Link} to={"/all_employee"}>Check for information of all employees</Button>
            </div>
        </div>
    );
}

export default EmployeeMainPage;
