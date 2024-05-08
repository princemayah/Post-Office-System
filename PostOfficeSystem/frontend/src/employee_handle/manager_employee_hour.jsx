import React, { useState } from 'react';
import { Button, Form, Container, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom";


const ManagerEmployeeHour = () => {
    const [employees_id, setEmployeeId] = useState('');
    const [workHours, setWorkHours] = useState([]); // <-- New state variable for working hours
    const [totalHoursSum, setTotalHoursSum] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allWorkHours, setAllWorkHours] = useState([]);

    const getHours = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('token');
        const employeeId = {
            employees_id
        };
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/manager_check_working_hours`, employeeId, /*{ headers: { 'Authorization': `Bearer ${token}` }}*/);

            console.log(response)

            if(!response.data.message){
                setAllWorkHours(response.data.workHours); //Get all work hours initially
                setWorkHours(response.data.workHours);
                setTotalHoursSum(response.data.totalHoursSum); // Set the total sum from the response
            }
            else{
                setAllWorkHours([]);
                setWorkHours([]);
                setTotalHoursSum(0); // Reset the total sum when there are no work hours
                alert(response.data.message);
            }
        } catch (error) {
            console.error('There was an error with the information:', error);
            setAllWorkHours([]);
            setWorkHours([]);
            setTotalHoursSum(0); // Reset the total sum on error
        }
    };

    const applyFilter = () => {
        const filtered = allWorkHours.filter(hour => {
            const workDate = new Date(hour.working_date.split('T')[0]);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return workDate >= start && workDate <= end;
        });

        // Calculate the sum of total hours for the filtered results
        const filteredTotalHoursSum = filtered.reduce((acc, current) => {
        // If total_hour is null or undefined, it won't contribute to the sum
            return acc + (current.total_hour ? parseFloat(current.total_hour) : 0);
        }, 0);
        setWorkHours(filtered);
        setTotalHoursSum(filteredTotalHoursSum.toFixed(2)); // Update the totalHoursSum with the sum of the filtered data
    };

    const resetFilter = () => {
        setWorkHours(allWorkHours); // Reset to all work hours
    };

    return(
        <>
        <Button variant="primary" as={Link} to={"/manager_mainpage"}>Return to manager mainpage</Button>
        <Container className="mt-5">
            <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-4">
                    <Form.Label>Enter Employee ID</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Employee ID" 
                        value={employees_id} 
                        onChange={(e) => setEmployeeId(e.target.value)} 
                    />
                </Form.Group>
                <Button variant="primary" onClick={getHours}>Get Hours</Button>
            </Form>
            
            {/* Form fields for filtering by date range */}
            <Form.Group className="mb-4">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </Form.Group>
            <Button variant="secondary" onClick={applyFilter}>Apply Filter</Button>
            <Button variant="outline-secondary" onClick={resetFilter}>Reset Filter</Button>


            <h3 className="mt-4">Employee ID: {employees_id}</h3>

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date</th>
                        <th>In Hour</th>
                        <th>Out Hour</th>
                        <th>Total Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {workHours.map((hour, index) => (
                        <tr key={index}>
                            <td>{hour.EFName}</td>
                            <td>{hour.ELName}</td>
                            {/* <td>{new Date(hour.working_date).toLocaleDateString()}</td> */}
                            <td>{hour.working_date.split('T')[0]}</td>
                            <td>{hour.in_hour}</td>
                            <td>{hour.out_hour}</td>
                            <td>{hour.total_hour}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="5" style={{ textAlign: "right" }}><strong>Total:</strong></td>
                        <td><strong>{totalHoursSum}</strong></td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
        </>
    )
}

export default ManagerEmployeeHour;
