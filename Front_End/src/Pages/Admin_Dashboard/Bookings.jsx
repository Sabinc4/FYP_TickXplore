import React, { useState, useEffect } from 'react';
import DataTable from '../../Component/Admin_DataTable';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingType, setBookingType] = useState('bus');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch bookings data from API
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setBookings(response.data.bookings);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter the bookings based on type (bus or vehicle) and search query
  const filteredBookings = bookings
    .filter(booking => bookingType === 'bus' ? booking.busId : booking.vehicleId)  // Adjust filter condition
    .filter(booking => 
      booking._id.includes(searchQuery) ||
      (booking.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())) ||
      (booking.busId?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())) ||  // Ensure field matches
      (booking.vehicleId?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()))
    );

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => setBookingType('bus')}
          className={`px-4 py-2 rounded-l-md ${bookingType === 'bus' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Bus Bookings
        </button>
        <button
          onClick={() => setBookingType('vehicle')}
          className={`px-4 py-2 rounded-r-md ${bookingType === 'vehicle' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Vehicle Bookings
        </button>
      </div>
      
      <input
        type="text"
        placeholder="Search bookings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <DataTable
        title={`${bookingType === 'bus' ? 'Bus' : 'Vehicle'} Bookings`}
        data={filteredBookings}
        fields={bookingType === 'bus' ? 
          ["_id", "user.name", "busId.name", "selectedSeats", "totalPrice", "status", "createdAt"] : 
          ["_id", "user.name", "vehicleId.name", "pickupPoint", "dropPoint", "totalPrice", "status", "createdAt"]}
        headers={bookingType === 'bus' ? 
          ["Booking ID", "User", "Bus", "Seats", "Price", "Status", "Date"] : 
          ["Booking ID", "User", "Vehicle", "Pickup", "Drop", "Price", "Status", "Date"]}
        renderCell={(item, field) => {
          if (field.includes('.')) {
            return field.split('.').reduce((obj, key) => (obj ? obj[key] : 'N/A'), item);
          }
          return item[field] ? item[field] : 'N/A';
        }}
        disableEdit={true}
      />
    </div>
  );
};

export default Bookings;
