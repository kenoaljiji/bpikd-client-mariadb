import axios from 'axios';
import React, { useContext } from 'react';
import { localhost } from '../../config/config';
import { useAlertContext } from '../../context/alert/AlertState';
import { ThemeContext } from '../../context/theme/ThemeContext';

const MaintenanceComponent = () => {
  const { setMaintenance, maintenance } = useContext(ThemeContext);
  const { setAlert } = useAlertContext();

  const toggleMaintenanceMode = async () => {
    try {
      const newMaintenanceStatus = !maintenance;
      await axios.put(`${localhost}/theme/maintenance`, {
        maintenance: newMaintenanceStatus,
      });

      setAlert('Maintenance mode updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update maintenance mode:', error);
      setAlert('Failed to update maintenance mode', 'danger');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <h4 className='my-2 mb-4 mt-5'>Maintenance Mode</h4>
      <div className='d-flex align-items-center'>
        <span className='me-2' style={{ fontWeight: 'bold' }}>
          Off
        </span>
        <label className='switch'>
          <input
            type='checkbox'
            checked={!maintenance}
            onChange={() => {
              toggleMaintenanceMode();
              setMaintenance(!maintenance);
            }}
          />
          <span className='slider round'></span>
        </label>
        <span className='ms-2' style={{ fontWeight: 'bold' }}>
          On
        </span>
      </div>
    </div>
  );
};

export default MaintenanceComponent;
