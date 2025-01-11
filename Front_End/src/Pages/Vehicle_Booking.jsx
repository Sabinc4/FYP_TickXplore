import React from 'react';
import myImage from '../Pictures/vehicle.jpg'; 

const Vehicle_Booking = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img
        src={myImage} 
        alt="Vehicle Booking"
        style={{ height: '100%', width: '1920px', objectFit: 'cover' }}
      />
    </div>
  );
};

export default Vehicle_Booking;
