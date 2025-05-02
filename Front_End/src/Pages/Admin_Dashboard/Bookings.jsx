import React, { useState, useEffect } from 'react';
import DataTable from '../../Component/Admin_DataTable';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingType, setBookingType] = useState('bus');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch bookings data from backend
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

  // Filter bookings by type (bus or vehicle) and search
  const filteredBookings = bookings
    .filter(booking =>
      bookingType === 'bus' ? booking.bus : booking.vehicle
    )
    .filter(booking =>
      booking._id.includes(searchQuery) ||
      (booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.bus?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.vehicle?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Fields to show in the table for each type
  const fields = bookingType === 'bus'
    ? ["_id", "user.name", "bus.name", "selectedSeats", "totalPrice", "commissionAmount", "vendorEarnings", "status", "date"]
    : ["_id", "user.name", "vehicle.name", "pickupPoint", "dropPoint", "totalPrice", "commissionAmount", "vendorEarnings", "status", "date"];

  // Headers to display for each type
  const headers = bookingType === 'bus'
    ? ["Booking ID", "User", "Bus", "Seats", "Price", "Commission", "Vendor Earnings", "Status", "Date"]
    : ["Booking ID", "User", "Vehicle", "Pickup", "Drop", "Price", "Commission", "Vendor Earnings", "Status", "Date"];

  // Render each cell
  const renderCell = (item, field) => {
    if (field.includes('.')) {
      return field.split('.').reduce((obj, key) => (obj ? obj[key] : 'N/A'), item);
    }

    if (["commissionAmount", "vendorEarnings", "totalPrice"].includes(field)) {
      return item[field] != null ? `Rs. ${item[field].toFixed(2)}` : 'N/A';
    }

    if (field === "selectedSeats") {
      return item[field]?.length ? item[field].join(", ") : "N/A";
    }

    if (field === "date" || field === "createdAt") {
      return item[field] ? new Date(item[field]).toLocaleString() : "N/A";
    }

    return item[field] ?? 'N/A';
  };

  // UI
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
        fields={fields}
        headers={headers}
        renderCell={renderCell}
        disableEdit={true}
      />
    </div>
  );
};

export default Bookings;
