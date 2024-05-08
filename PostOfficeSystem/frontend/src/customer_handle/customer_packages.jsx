import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DataTable.css';  // Importing the CSS
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';


const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noDataMessage, setNoDataMessage] = useState('');

  const fetchData = useCallback(async (start = startDate, end = endDate) => {
    setNoDataMessage(''); // Clear any previous no data message
    const token = sessionStorage.getItem('token');
    const params = {};
    if (start) params.startDate = start;
    if (end) params.endDate = end;

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/customer_packages`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      
      if (response.data && response.data.result) {
        setTableData(response.data.result);

      } else {
        setTableData([]);
        setNoDataMessage("No packages found.");
      }
    } catch (error) {
      console.error("There was an issue fetching the data: ", error);
      setNoDataMessage("There was an error retrieving the data. Please try again later.");
    }
  }, [startDate, endDate]);

    const deletePackage = async (packageId) => {
      if(window.confirm("Are you sure you want to delete this package?")) {
        try {
          // Corrected URL to match the backend's expected endpoint
          const response = await axios.delete(`${process.env.REACT_APP_SERVER}/delete_packages/${packageId}`);
          if(response.status === 200) {
            // Directly filter out the deleted package from the tableData state
            setTableData(currentData => currentData.filter(row => row.packages_id !== packageId));
          }
        } catch (error) {
          console.error("Error deleting the package: ", error);
          // Optionally, update the UI to reflect the error
        }
      }
    };

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
    <Button variant="primary" as={Link} to={"/customer_mainpage"}>Return to the mainpage</Button>
      <div className="container mt-5">
        <div className="filter-container">
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
      {tableData.length > 0 ? (
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Package ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>From Address</th> {/* New column */}
            <th>To Address</th> {/* New column */}
            <th>Status</th>
            <th>Date Created</th>
            <th>Employee Handle ID</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.packages_id}>
              <td>{row.packages_id}</td>
              <td>{row.sender}</td>
              <td>{row.receiver}</td>
              <td>{row.from_address}</td> {/* New column */}
              <td>{row.to_address}</td> {/* New column */}
              <td>{row.package_status}</td>
              <td>{row.package_date.split('T')[0]}</td>
              <td>{row.employees_handle_id}</td> {/* New column */}
              <td>
              {row.package_status === 'just created' && (
                <button
                  onClick={() => deletePackage(row.packages_id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              )}
            </td>
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

export default DataTable;
