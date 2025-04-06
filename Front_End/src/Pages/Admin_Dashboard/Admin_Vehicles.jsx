import React, { useState } from 'react';
import VehicleCards from '../../Component/Admin_VehicleCards';
import { useOutletContext } from 'react-router-dom';

const Admin_Vehicles = () => {
  const { vehicles, loading, error } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error loading vehicles: {error}</div>;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search vehicles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <VehicleCards vehicles={filteredVehicles} loading={loading} />
    </div>
  );
};

export default Admin_Vehicles;