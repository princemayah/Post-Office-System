import React, { useState } from 'react';
import axios from 'axios';


const TrackingForm = () => {

  const [packages_id, setPackageId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trackingnumber = {
      packages_id
    };

    axios.post(`${process.env.REACT_APP_SERVER}/tracking_package`, trackingnumber)
      .then((response) => {
        console.log("API Response:", response.data);  // Debugging line
        if (Array.isArray(response.data)) {
          setTrackingInfo(response.data);
        } else if (response.data.message) {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Tracking Your Package</h5>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="packages_id">Enter your tracking number</label>
                  <input type="text" className="form-control" id="packages_id" placeholder="Tracking Number Here" value={packages_id} onChange={(e) => setPackageId(e.target.value)} required />
                </div>
                <input type="submit" className="btn btn-primary btn-block" value="Submit" />
              </form>

              {trackingInfo && (
                <div className="mt-4">
                  <h6>Tracking Information:</h6>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tracking_number</th>
                        <th>Location_id</th>
                        <th>Time_Stamp</th>
                        <th>Employee's handle id</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    {trackingInfo.map((row, index) => (
                        <tr key={index}>
                        <td>{row.tracking_number}</td>
                        <td>{row.location_id}</td>
                        <td>{new Date(row.time_stamp).toLocaleString()}</td>
                        <td>{row.employees_handle_id}</td>
                        <td>{row.package_status}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingForm;
