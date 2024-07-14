import React, { useState } from 'react';
import MaintenanceIcon from '../../icons/MaintenanceIcon';
import './maintenancePage.scss';

const MaintenancePage = () => {
  return (
    <div className='maintenance'>
      <div>
        <MaintenanceIcon />

        <div className='maintenance-heading my-4'>
          <h2 className=''>Under Maintenance</h2>
          <p>
            We are currently performing some scheduled maintenance. We will be
            back as soon as possible. Please check back soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
