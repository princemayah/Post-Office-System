import React from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { FaUser, FaUserPlus, FaUserTie, FaBoxOpen, FaSearch } from "react-icons/fa"; // import icons
import moment from 'moment-timezone';

const MainPage = () => {
    const fullDateTime = moment.tz("America/Chicago").format();
    console.log(fullDateTime); // This will give you a complete timestamp.
    return (
        <div className="d-flex flex-column align-items-center vh-100 justify-content-center bg-secondary text-white">
            <h1 className="mb-4 display-3 font-weight-bold">Post Office System</h1>
            <div className="bg-light text-dark rounded p-4 shadow-lg">
                <div className="mb-3">
                    <Button variant="outline-dark" as={Link} to={"/customer_login"}><FaUser /> Customer Login</Button>
                </div>
                <div className="mb-3">
                    <Button variant="outline-dark" as={Link} to={"/customer_signup"}><FaUserPlus /> Sign Up</Button>
                </div>
                <div className="mb-3">
                    <Button variant="outline-dark" as={Link} to={"/employee_login"}><FaUserTie /> Employee Login</Button>
                </div>
                <div className="mb-3">
                    <Button variant="outline-dark" as={Link} to={"/create_package"}><FaBoxOpen /> Create Package</Button>
                </div>
                <div className="mb-3">
                    <Button variant="outline-dark" as={Link} to={"/track_package"}><FaSearch /> Track Package</Button>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
