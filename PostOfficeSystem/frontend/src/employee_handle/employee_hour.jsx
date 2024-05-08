import React, { useState, useEffect } from 'react';
import {Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom";


const GetEmployeeHour = () => {
  const [workHours, setWorkHours] = useState([]); // <-- New state variable for working hours
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    const token = sessionStorage.getItem('token');
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/employee_check_working_hours`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.data.message) {
        setWorkHours(response.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('There was an error with the information:', error);
    }
  };

  // Effect hook to fetch data on mount
  useEffect(() => {
    fetchData();
  }, []); // Empty array ensures this effect runs once on mount

  const handleFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const filtered = workHours.filter((hour) => {
        const workingDate = new Date(hour.working_date.split('T')[0]);
        return workingDate >= start && workingDate <= end;
      });
      setWorkHours(filtered);
    } else {
      // Optionally handle the case where dates are not selected properly
      alert('Please select both a start and end date to filter.');
    }
  };
  
  // Function to reset the filter
  const resetFilter = () => {
    // Here you would refetch the data or otherwise reset it
    fetchData(); // Assuming fetchData sets workHours to the full unfiltered data
  };

  const calculateTotalHours = () => {
    return workHours.reduce((acc, current) => acc + parseFloat(current.total_hour || 0), 0);
  };

  return (
    <>
    <Button variant="primary" as={Link} to={"/employee_mainpage"}>Return to employee mainpage</Button>
    <Container className="mt-5">
      <Form>
        <Form.Group controlId="startDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="endDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="secondary" onClick={resetFilter}>
          Reset Filter
        </Button>
      </Form>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>In Hour</th>
            <th>Out Hour</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {workHours.map((hour, index) => (
            <tr key={index}>
              <td>{hour.working_date.split('T')[0]}</td>
              <td>{hour.in_hour}</td>
              <td>{hour.out_hour}</td>
              <td>{hour.total_hour}</td>
            </tr>
          ))}
          {workHours.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No hours found or no filter applied.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={{ textAlign: "right" }}><strong>Total Hours:</strong></td>
            <td><strong>{calculateTotalHours()}</strong></td>
          </tr>
        </tfoot>
      </Table>
    </Container>
    </>
  );
};

export default GetEmployeeHour;
