import React, { useState } from 'react';
import BusCards from '../../Component/Admin_BusCards';
import { useOutletContext } from 'react-router-dom';

const Admin_Buses = () => {
  const { buses, loading, error } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuses = buses.filter(bus => 
    bus.busName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.pickupPoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.dropPoint?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading buses...</div>;
  if (error) return <div>Error loading buses: {error}</div>;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search buses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <BusCards buses={filteredBuses} loading={loading} />
    </div>
  );
};

export default Admin_Buses;