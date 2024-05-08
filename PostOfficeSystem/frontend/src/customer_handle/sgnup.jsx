import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

const RegistrationForm = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email , setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registrationData = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      street_address: streetAddress,
      city,
      state,
      zip_code: zipCode,
      email
    };

    axios.post(`${process.env.REACT_APP_SERVER}/customer_signup`, registrationData)
      .then((response) => {
        alert(response.data.message);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
    <Button variant="primary" as={Link} to={"/"}>Return to home</Button>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6"> {/* Increased width for better layout */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Register</h5>
              <form onSubmit={handleSubmit}>
                {/* Existing Username and Password Fields */}
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" className="form-control" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {/* New Fields for Registration */}
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input type="date" className="form-control" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="streetAddress">Street Address</label>
                  <input type="text" className="form-control" id="streetAddress" placeholder="Street Address" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" className="form-control" id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input type="text" className="form-control" id="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input type="text" className="form-control" id="zipCode" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" placeholder="Email (not required but suggested for notifications)" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <input type="submit" className="btn btn-primary btn-block" value="Register" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegistrationForm;
