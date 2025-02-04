import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
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
      toast.error(" Vendor ID is missing. Please log in again.");
      return;
    }
    fetchData();
  }, [vendorId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, bookingsRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:3001/vendor/get-vehicles/${vendorId}`),
        axios.get(`http://localhost:3001/vendor/get-bookings/${vendorId}`),
        axios.get(`http://localhost:3001/vendor/get-stats/${vendorId}`),
      ]);
      setVehicles(vehiclesRes.data.vehicles);
      setBookings(bookingsRes.data.bookings);
      setStats(statsRes.data);
    } catch (error) {
      toast.error(" Error fetching data.");
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
              className={`p-2 cursor-pointer ${activeSection === section ? "bg-gray-300" : ""}`}
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
          <p>Loading...</p>
        ) : (
          <>
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded-lg text-center">
                  <h3 className="text-lg font-bold">{stats.vehicles}</h3>
                  <p className="text-gray-600">Total Vehicles</p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg text-center">
                  <h3 className="text-lg font-bold">{stats.bookings}</h3>
                  <p className="text-gray-600">Total Bookings</p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg text-center">
                  <h3 className="text-lg font-bold">${stats.earnings}</h3>
                  <p className="text-gray-600">Total Earnings</p>
                </div>
              </div>
            )}

            {/* Vehicles Section */}
            {activeSection === "vehicles" && (
              <div className="bg-white p-4 shadow rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">My Vehicles</h1>
                {vehicles.length === 0 ? (
                  <p>No vehicles found.</p>
                ) : (
                  <table className="w-full bg-white shadow-md rounded-lg">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Vehicle Name</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Price Per Day</th>
                        <th className="p-2">Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle._id} className="border-b text-center">
                          <td className="p-2">{vehicle.name}</td>
                          <td className="p-2">{vehicle.type}</td>
                          <td className="p-2">${vehicle.pricePerDay}</td>
                          <td className="p-2">{vehicle.isAvailable ? "Available" : "Unavailable"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Bookings Section */}
            {activeSection === "bookings" && (
              <div className="bg-white p-4 shadow rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
                {bookings.length === 0 ? (
                  <p>No bookings found.</p>
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
                          <td className="p-2">{booking.vehicleId && booking.vehicleId.name ? booking.vehicleId.name : "N/A"}</td>
                          <td className="p-2">{booking.userId && booking.userId.name ? booking.userId.name : "N/A"}</td>
                          <td className="p-2">{new Date(booking.startDate).toLocaleDateString()}</td>
                          <td className="p-2">{new Date(booking.endDate).toLocaleDateString()}</td>
                          <td className="p-2">
                            ${typeof booking.price === "object" ? parseFloat(booking.price.$numberDecimal).toFixed(2) : booking.price}
                          </td>
                          <td className="p-2">{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;
