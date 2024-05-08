import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../customer_handle/DataTable.css';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';


const AllEmployee = () => {
  const [tableData, setTableData] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State to keep track of the current page
  const [pageSize] = useState(20); // Set the page size to 20

  const fetchData = useCallback(async () => {
    const queryParams = new URLSearchParams({
      page: currentPage,
      limit: pageSize,
    });

    if (locationFilter) {
      queryParams.append('location_id', locationFilter);
    }

    if (roleFilter) {
      queryParams.append('e_role', roleFilter);
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/all_employee?${queryParams}`);
      if (!response.data.message) {
        setTableData(response.data);
      }
    } catch (error) {
      console.error("There was an issue fetching the data: ", error);
    }
  }, [currentPage, pageSize, locationFilter, roleFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

    const handleDelete = async (employeeId) => {
      if(window.confirm("Are you sure you want to delete this employee?")) {
        try {
          await axios.delete(`${process.env.REACT_APP_SERVER}/delete_employee/${employeeId}`);
          const newTableData = tableData.filter(row => row.employees_id !== employeeId);
          setTableData(newTableData);
        }   catch (error) {
          console.error("Error deleting the employee: ", error);
        }
      }
    };

    const applyFilters = () => {
      setCurrentPage(1); // Reset to page 1 when new filters are applied
      fetchData();
    };
  
    // Handlers to change page
    const goToNextPage = () => {
      setCurrentPage((prev) => prev + 1);
    };
  
    const goToPreviousPage = () => {
      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

  return (
    <>
    <Button variant="primary" as={Link} to={"/manager_mainpage"}>Return to manager mainpage</Button>
    <div className="container mt-5">
      <div className="filters">
        <input
          type="text"
          placeholder="Location ID"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Employee ID</th>
            <th>Employee SSN</th>
            <th>First name</th>
            <th>Last name</th>
            <th>E username</th>
            <th>E password</th>
            <th>Location ID</th>
            <th>Role</th>
            <th>Total Packages</th> {/* New header for total packages */}
	    <th>Actions</th> {/* New column for delete action */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.employees_id}>
              <td>{row.employees_id}</td>
              <td>{row.employees_ssn}</td>
              <td>{row.EFname}</td>
              <td>{row.ELname}</td>
              <td>{row.e_username}</td>
              <td>{row.e_password}</td>
              <td>{row.location_id}</td>
              <td>{row.e_role}</td> {/* New column */}
              <td>{row.total_packages}</td> {/* New cell for total packages */}
	      <td>
                <button onClick={() => handleDelete(row.employees_id)}>Delete</button>
              </td> {/* New column with delete button */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default AllEmployee;
