import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../customer_handle/DataTable.css';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

const AllPackages = () => {
  const [tableData, setTableData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noDataMessage, setNoDataMessage] = useState('');


  const fetchData = useCallback(async (start = startDate, end = endDate) => {
    setNoDataMessage(''); // Clear any previous no data message
  
    const params = {};
    if (start) params.startDate = start;
    if (end) params.endDate = end;

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/all_packages`, { params });
      
      if (response.data && response.data.packages) {
        setTableData(response.data.packages);

        console.log('cost: ', response.data.totalCost);

        setTotalCost(response.data.totalCost);
      } else {
        setTableData([]);
        setTotalCost(0);
        setNoDataMessage("No packages found.");
      }
    } catch (error) {
      console.error("There was an issue fetching the data: ", error);
      setNoDataMessage("There was an error retrieving the data. Please try again later.");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateChange = async (start, end) => {
    setStartDate(start);
    setEndDate(end);
    await fetchData(start,end);
  };

  return (
    <>
    <Button variant="primary" as={Link} to={"/employee_mainpage"}>Return to employee mainpage</Button>
    <div className="container mt-5">
      <div className="date-range-inputs">
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange(e.target.value, endDate)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange(startDate, e.target.value)}
        />
      </div>
      <div>Total Cost: {totalCost}</div>

      {tableData.length > 0 ? (
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Package ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>From Address</th>
              <th>To Address</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Employee Handle ID</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.packages_id}>
                <td>{row.packages_id}</td>
                <td>{row.sender}</td>
                <td>{row.receiver}</td>
                <td>{row.from_address}</td>
                <td>{row.to_address}</td>
                <td>{row.package_date.split('T')[0]}</td>
                <td>{row.package_status}</td>
                <td>{row.employees_handle_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data-message">
          {noDataMessage}
        </div>
      )}
    </div>
    </>
  );
};

export default AllPackages;

