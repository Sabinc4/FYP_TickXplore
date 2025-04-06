import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const vendorId = localStorage.getItem("vendorId");
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3001/api";

  // Vehicle API Functions
  const fetchVehicles = (vendorId) => axios.get(`${API_BASE_URL}/vehicles?vendorId=${vendorId}`);
  // Bus API Functions
  const fetchBuses = (vendorId) => axios.get(`${API_BASE_URL}/buses?vendorId=${vendorId}`);

  useEffect(() => {
    fetchData();
  }, [vendorId]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vehiclesRes, busesRes] = await Promise.all([
        fetchVehicles(vendorId),
        fetchBuses(vendorId),
      ]);
  
      setVehicles(vehiclesRes.data.vehicles || []);
      setBuses(busesRes.data.buses || []);
  
      if (vehiclesRes.data.vehicles.length === 0 && busesRes.data.buses.length === 0) {
        toast.info("No vehicles or buses found. Please add one to get started.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status !== 404) {
        setError("Failed to load data. Please check your network and try again.");
        toast.error("Failed to load data. Please check your network and try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Dashboard Data for Summary Cards and Chart
  const dashboardData = [
    { name: "Vehicles", count: vehicles.length, color: "#3B82F6" },
    { name: "Buses", count: buses.length, color: "#10B981" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <aside className="w-64 bg-gray-800 text-white p-5 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Vendor Portal
        </h2>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/VendorDashboard" 
              className={`p-3 cursor-pointer rounded-md flex items-center gap-3 transition-colors ${location.pathname === '/VendorDashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
            >
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/VendorDashboard/vehicles" 
              className={`p-3 cursor-pointer rounded-md flex items-center gap-3 transition-colors ${location.pathname.includes('/vehicles') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
            >
              <span>Vehicles</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/VendorDashboard/buses" 
              className={`p-3 cursor-pointer rounded-md flex items-center gap-3 transition-colors ${location.pathname.includes('/buses') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
            >
              <span>Buses</span>
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-6 flex justify-between items-center">
                <p>{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* This will render the nested routes */}
            <Outlet context={{ vehicles, buses, fetchData }} />
            
            {/* Dashboard content when at the root path */}
            {location.pathname === '/Vendor_Dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardData.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      <h3 className="text-lg font-semibold text-gray-700">
                        {item.name}
                      </h3>
                      <p className="text-3xl font-bold mt-2" style={{ color: item.color }}>
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Entity Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="count"
                          name="Total Count"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;