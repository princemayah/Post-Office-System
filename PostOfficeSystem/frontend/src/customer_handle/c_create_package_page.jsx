import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';


const CreatePackageForm = () => {

  const navigate = useNavigate();

  const [weight, setWeight] = useState('');
//   const [street_address_from, setStreetAddressFrom] = useState('');
//   const [city_from, setCityFrom] = useState('');         STATED IN THE .JS FILE
//   const [state_from, setStateFrom] = useState('');
//   const [zip_from, setZipFrom] = useState('');
  const [street_address_to, setStreetAddressTo] = useState('');
  const [city_to, setCityTo] = useState('');
  const [state_to, setStateTo] = useState('');
  const [zip_to, setZipTo] = useState('');
  const [receive_f_name, setReceiveFName] = useState('');
  const [receive_l_name, setReceiveLName] = useState('');
  const [location_name, setLocationName] = useState('');
  const [receive_email, setReceiveEmail] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/get_locations`);
        setLocations(response.data); // Set the locations in state
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
  
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createPackageData = {
        weight,
        // street_address_from,
        // city_from,
        // state_from,
        // zip_from,
        street_address_to,
        city_to,
        state_to,
        zip_to,
        location_name,
        receive_f_name,
        receive_l_name,
        receive_email
    };

    const token = sessionStorage.getItem('token'); //This is where you get the token from localStorage


    axios.post(`${process.env.REACT_APP_SERVER}/customer_create_package`, createPackageData, {headers : {'Authorization': `Bearer ${token}`}})
      .then((response) => {
        console.log(response.data);
        alert(response.data.message);
        navigate('/customer_mainpage')
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
     <Button variant="primary" as={Link} to={"/customer_mainpage"}>Return to the mainpage</Button>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Create Package</h5>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="weight">Weight</label>
                  <input type="number" step="any" className="form-control" id="weight" placeholder="Enter the weight of your package" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label htmlFor="street_address_to">Street Address To</label>
                  <input type="text" className="form-control" id="street_address_to" placeholder="Enter the destination street address" value={street_address_to} onChange={(e) => setStreetAddressTo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="city_to">City To</label>
                  <input type="text" className="form-control" id="city_to" placeholder="Enter the destination city" value={city_to} onChange={(e) => setCityTo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state_to">State To</label>
                  <input type="text" className="form-control" id="state_to" placeholder="Enter the destination state" value={state_to} onChange={(e) => setStateTo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="zip_to">Zip Code To</label>
                  <input type="text" className="form-control" id="zip_to" placeholder="Enter the destination zip code" value={zip_to} onChange={(e) => setZipTo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="location_name">Post Office Code</label>
                  <select className="form-control" id="location_name" value={location_name} onChange={(e) => setLocationName(e.target.value)} required>
                    <option value="">Select a location</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location.lname}>{location.lname}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="receive_f_name">Receiver's First Name</label>
                  <input type="text" className="form-control" id="receive_f_name" placeholder="Enter the receiver's first name" value={receive_f_name} onChange={(e) => setReceiveFName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="receive_l_name">Receiver's Last Name</label>
                  <input type="text" className="form-control" id="receive_l_name" placeholder="Enter the receiver's last name" value={receive_l_name} onChange={(e) => setReceiveLName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="receive_email">Receiver's Email</label>
                  <input type="text" className="form-control" id="receive_email" placeholder="Not required, only for notifications" value={receive_email} onChange={(e) => setReceiveEmail(e.target.value)} />
                </div>
                <input type="submit" className="btn btn-primary btn-block" value="Create Package" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreatePackageForm;
