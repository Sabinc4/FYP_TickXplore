import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    vehicles: [],
    buses: [],
    bookings: [],
    loading: true,
    error: null,
    sidebarOpen: false,
  });

  const vendorId = localStorage.getItem("vendorId");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const API_BASE_URL = "http://localhost:3001/api";

  // Axios instance with Authorization header
  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

      const [vehiclesRes, busesRes, bookingsRes] = await Promise.all([
        authAxios.get(`/vehicles?vendorId=${vendorId}`),
        authAxios.get(`/buses?vendorId=${vendorId}`),
        authAxios.get(`/bookings?vendorId=${vendorId}`),
      ]);

      const newData = {
        vehicles: vehiclesRes.data.vehicles || [],
        buses: busesRes.data.buses || [],
        bookings: bookingsRes.data.bookings || [],
        loading: false,
      };

      setDashboardData(newData);

      if (
        newData.vehicles.length === 0 &&
        newData.buses.length === 0 &&
        newData.bookings.length === 0
      ) {
        toast.info("No vehicles, buses, or bookings found.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data.", {
        position: "top-right",
        autoClose: 5000,
      });
      setDashboardData((prev) => ({ ...prev, error: "Failed to load data.", loading: false }));
    }
  }, [vendorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalEarnings = dashboardData.bookings
    .filter((b) => b.status === "Booked")
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const summaryCards = [
    { name: "Vehicles", count: dashboardData.vehicles.length, color: "#3B82F6" },
    { name: "Buses", count: dashboardData.buses.length, color: "#10B981" },
    { name: "Bookings", count: dashboardData.bookings.length, color: "#F59E0B" },
    { name: "Earnings", count: `₹${totalEarnings.toLocaleString()}`, color: "#6366F1" },
  ];

  const bookingsByStatus = ["Booked", "Pending", "Cancelled"].map((status) => {
    const colorMap = {
      Booked: "#10B981",
      Pending: "#F59E0B",
      Cancelled: "#EF4444",
    };
    return {
      name: status,
      value: dashboardData.bookings.filter((b) => b.status === status).length,
      color: colorMap[status],
    };
  });

  const navLinks = [
    { label: "Dashboard", path: "/VendorDashboard" },
    { label: "Vehicles", path: "/VendorDashboard/vehicles" },
    { label: "Buses", path: "/VendorDashboard/buses" },
    { label: "Bookings", path: "/VendorDashboard/bookings" },
  ];

  const toggleSidebar = () => {
    setDashboardData((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer theme="colored" />

      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {dashboardData.sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`w-64 bg-gray-800 text-white p-5 border-r border-gray-700 fixed lg:relative lg:translate-x-0 h-screen z-40 transform transition-transform duration-200 ease-in-out ${
          dashboardData.sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-6">Vendor Portal</h2>
        <nav>
          <ul className="space-y-2">
            {navLinks.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setDashboardData((prev) => ({ ...prev, sidebarOpen: false }))}
                  className={`block p-3 rounded-md transition-colors ${
                    location.pathname === path ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {dashboardData.loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {dashboardData.error && (
              <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>{dashboardData.error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            <Outlet context={{ ...dashboardData, fetchData }} />

            {location.pathname === "/VendorDashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {summaryCards.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      <h3 className="text-base md:text-lg font-semibold text-gray-700">
                        {item.name}
                      </h3>
                      <p
                        className="text-2xl md:text-3xl font-bold mt-2"
                        style={{ color: item.color }}
                      >
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Entity Distribution</h2>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={summaryCards.filter((d) => d.name !== "Earnings")}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="count"
                            name="Total Count"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Booking Status</h2>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bookingsByStatus}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, value }) => (value > 0 ? `${name}: ${value}` : '')}
                          >
                            {bookingsByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
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
