import React, { useState, useCallback, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Form, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import './EmployeeMainPage.css';  // Make sure to create this CSS file


const EmployeeMainPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageStatus, setPackageStatus] = useState('');

  const token = sessionStorage.getItem('token');
  const handleAssign = async () => {
    const payload = {
        trackingNumber,
        packageStatus  // Include packageStatus in the payload
    };
    
    try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER}/employee_mainpage`, payload, { headers: { 'Authorization': `Bearer ${token}` }});
        alert(response.data.message);
    } catch (error) {
        console.error('There was an error with the assignment:', error);
    }
  };

  const handleInHour = async () => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/in_hour`,{headers : {'Authorization': `Bearer ${token}`}});
      alert(response.data.message);
    }
    catch (error) {
      console.error('There was an error with logging the hour: ', error);
    };
  }

  const handleOuthour = async () => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/out_hour`,{headers : {'Authorization': `Bearer ${token}`}});
      alert(response.data.message);
    }
    catch (error) {
      console.error('There was an error with logging the hour: ', error);
    }
  };

  const pollClockOut = useCallback(async () => {
    console.log('Polling for clock out status...'); // Debug line
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/check_clock_out`, { headers: { 'Authorization': `Bearer ${token}` } });
      console.log('Response from /check_clock_out:', response.data); // Debug line
      if (response.data.shouldClockOut) {
        alert('Please clock out now. It is almost 8 hours');
      }
    } catch (error) {
      console.error('There was an error with the clock out check: ', error);
    }
  }, [token]); // token is a dependency here

  useEffect(() => {
    const intervalId = setInterval(pollClockOut, 300000); // Poll every 5 minutes
    return () => clearInterval(intervalId);
  }, [pollClockOut]); // pollClockOut is now a dependency

  const getCurrentDate = () => {
    const today = new Date();
    return today.toDateString(); // You can adjust the formatting as needed
  };

  return (
    <div>
      <h3>To log out, just close the tab</h3>
    <Container className="mt-5">
    <Card className="mb-4 p-4 shadow">
      <Card.Title><h1>Welcome Back</h1></Card.Title>
      <Card.Text>
        You can check the system's existing packages or update the status of a package.
      </Card.Text>
      <Button variant="primary" as={Link} to={"/all_packages"} className="mb-4">Check for Existing Packages</Button>
    </Card>

    <Card className="p-4 shadow">
      <Form.Group className="mb-4">
        <Form.Label>Enter Tracking Number</Form.Label>
        <Form.Control type="number" placeholder="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Select Package Status</Form.Label>
        <Form.Select value={packageStatus} onChange={(e) => setPackageStatus(e.target.value)}>
          <option value="" disabled>Select a status</option>
          <option value="Received">Received</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </Form.Select>
      </Form.Group>

      <Button variant="success" onClick={handleAssign}>Assign</Button>

      <span className="mt-4 d-block">Working hours log</span>
        <Card.Title className="mt-2">{`Current Date: ${getCurrentDate()}`}</Card.Title>
        <Button variant="info" className="mt-2" onClick={handleInHour}>Log In Hour</Button>
        <Button variant="warning" className="mt-2 ms-3" onClick={handleOuthour}>Log Out Hour</Button>
    </Card>
    <Button variant="primary" as={Link} to={"/employee_check_working_hours"} className="mb-4">Check for your hours in the most recent 32 days</Button>
  </Container>
  </div>
  );
}

export default EmployeeMainPage;
