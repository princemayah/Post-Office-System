import React from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

const CustomerMainPage = () => {
    return (
        <div>
            <h1>Welcome Back</h1>
            <h3> To log out, just close the tab</h3>
            <div>
                <Button variant="primary" as={Link} to={"/customer_packages"}>Click here to check for your existing packages</Button>
                <Button variant="primary" as={Link} to={"/customer_create_package"}>Click here to create new packages</Button>
            </div>
        </div>
    );
}

export default CustomerMainPage;