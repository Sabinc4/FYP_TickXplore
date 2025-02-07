import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);
  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    if (!vendorId) {
      toast.error("Vendor ID is missing. Please log in again.");
      return;
    }
    fetchData();
  }, [vendorId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, bookingsRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/vehicles/vendor/${vendorId}`),
        axios.get(`http://localhost:3001/api/bookings/vendor/${vendorId}`),
        axios.get(`http://localhost:3001/api/vendor-stats/${vendorId}`),
      ]);
      setVehicles(vehiclesRes.data.vehicles || []);
      setBookings(bookingsRes.data.bookings || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      toast.error("Error fetching data. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />

      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 border-r">
        <h2 className="text-xl font-bold mb-4">Vendor Dashboard</h2>
        <ul>
          {["dashboard", "vehicles", "bookings"].map((section) => (
            <li
              key={section}
              className={`p-3 cursor-pointer rounded-md ${
                activeSection === section ? "bg-blue-500 text-white" : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <>
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <div className="grid grid-cols-3 gap-4">
                <StatCard title="Total Vehicles" value={stats.vehicles} />
                <StatCard title="Total Bookings" value={stats.bookings} />
                <StatCard title="Total Earnings" value={`$${stats.earnings}`} />
              </div>
            )}

            {/* Vehicles Section */}
            {activeSection === "vehicles" && (
              <VehicleList vehicles={vehicles} />
            )}

            {/* Bookings Section */}
            {activeSection === "bookings" && (
              <BookingList bookings={bookings} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ✅ Reusable Dashboard Card
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 shadow rounded-lg text-center">
    <h3 className="text-lg font-bold">{value}</h3>
    <p className="text-gray-600">{title}</p>
  </div>
);

// ✅ Vehicles List Component
const VehicleList = ({ vehicles }) => (
  <div className="bg-white p-4 shadow rounded-lg">
    <h1 className="text-2xl font-semibold mb-4">My Vehicles</h1>
    {vehicles.length === 0 ? (
      <p className="text-center text-gray-500">No vehicles found.</p>
    ) : (
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-2">Image</th>
            <th className="p-2">Vehicle Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id} className="border-b text-center">
              <td className="p-2">
                <img
                  src={vehicle.image ? `http://localhost:3001/uploads/${vehicle.image}` : "https://via.placeholder.com/100"}
                  alt={vehicle.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </td>
              <td className="p-2">{vehicle.name}</td>
              <td className="p-2">{vehicle.type}</td>
              <td className="p-2">${vehicle.pricePerSeat}</td>
              <td className="p-2">{vehicle.isAvailable ? "Available" : "Unavailable"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// ✅ Bookings List Component
const BookingList = ({ bookings }) => (
  <div className="bg-white p-4 shadow rounded-lg">
    <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
    {bookings.length === 0 ? (
      <p className="text-center text-gray-500">No bookings found.</p>
    ) : (
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-2">Vehicle</th>
            <th className="p-2">User</th>
            <th className="p-2">Start Date</th>
            <th className="p-2">End Date</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="border-b text-center">
              <td className="p-2">{booking.vehicleId?.name || "N/A"}</td>
              <td className="p-2">{booking.userId?.name || "N/A"}</td>
              <td className="p-2">{new Date(booking.startDate).toLocaleDateString()}</td>
              <td className="p-2">{new Date(booking.endDate).toLocaleDateString()}</td>
              <td className="p-2">${booking.price}</td>
              <td className="p-2">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default VendorDashboard;
