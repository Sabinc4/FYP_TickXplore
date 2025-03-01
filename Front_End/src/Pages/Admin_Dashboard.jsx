import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [buses, setBuses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch Data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, vendorsRes, adminsRes, busesRes, vehiclesRes] =
        await Promise.all([
          axios.get("http://localhost:3001/admin/get-users"),
          axios.get("http://localhost:3001/admin/get-vendors"),
          axios.get("http://localhost:3001/admin/get-admins"),
          axios.get("http://localhost:3001/api/buses?admin=true"),
          axios.get("http://localhost:3001/api/vehicles?admin=true"),
        ]);

      setUsers(usersRes.data.users || []);
      setVendors(vendorsRes.data.vendors || []);
      setAdmins(adminsRes.data.admins || []);
      setBuses(busesRes.data.buses || busesRes.data.data || []);
      setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data.data || []);
    } catch (error) {
      setError("Failed to load data. Please try again.");
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle Vendor Activation
  const toggleVendorStatus = async (vendorId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/admin/toggle-vendor/${vendorId}`
      );
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      toast.error("Failed to update vendor status.");
    }
  };

  // Filter Data Based on Search Query
  const filterData = (data, fields) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      fields.some((field) =>
        String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleEditUser = (user) => {
    const updatedName = prompt("Enter new name:", user.name);
    if (!updatedName || updatedName.trim() === "") {
      toast.error("⚠️ User name cannot be empty.");
      return;
    }

    axios
      .put(`http://localhost:3001/admin/edit-user/${user._id}`, { name: updatedName })
      .then((response) => {
        console.log("✅ User updated:", response.data);
        toast.success(response.data.message);
        fetchData();
      })
      .catch((error) => {
        console.error("❌ Failed to update user:", error.response ? error.response.data : error);
        toast.error(error.response?.data?.message || "Failed to update user.");
      });
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://localhost:3001/admin/delete-user/${userId}`)
      .then((response) => {
        toast.success(response.data.message);
        fetchData();
      })
      .catch(() => toast.error("Failed to delete user."));
  };

  const handleEditVendor = (vendor) => {
    const updatedName = prompt("Enter new vendor name:", vendor.vendorName);
    if (!updatedName) return;

    axios
      .put(`http://localhost:3001/admin/edit-vendor/${vendor._id}`, { vendorName: updatedName })
      .then((response) => {
        console.log("✅ Vendor updated:", response.data);
        toast.success(response.data.message);
        fetchData();
      })
      .catch((error) => {
        console.error("❌ Failed to update vendor:", error.response ? error.response.data : error);
        toast.error(error.response?.data?.message || "Failed to update vendor.");
      });
  };

  const handleDeleteVendor = (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    axios
      .delete(`http://localhost:3001/admin/delete-vendor/${vendorId}`)
      .then((response) => {
        toast.success(response.data.message);
        fetchData();
      })
      .catch(() => toast.error("Failed to delete vendor."));
  };

  // Paginated Data
  const paginatedBuses = buses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedVehicles = vehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(buses.length / itemsPerPage);

  // Dashboard Data for Summary Cards and Chart
  const dashboardData = [
    { name: "Users", count: users.length, color: "#3B82F6" },
    { name: "Vendors", count: vendors.length, color: "#10B981" },
    { name: "Admins", count: admins.length, color: "#F59E0B" },
    { name: "Buses", count: buses.length, color: "#8B5CF6" },
    { name: "Vehicles", count: vehicles.length, color: "#EF4444" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer />

      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-6 border-r">
        <h2 className="text-2xl font-bold mb-8 text-blue-700">Admin Dashboard</h2>
        <ul className="space-y-3">
          {["dashboard", "users", "vendors", "admins", "buses", "vehicles"].map(
            (section) => (
              <li
                key={section}
                className={`p-3 cursor-pointer rounded-md transition-all ${
                  activeSection === section
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveSection(section);
                  setSearchQuery(""); // Reset search query on section change
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            )
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Error Message */}
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

            {/* Dashboard Section */}
            {activeSection === "dashboard" ? (
              <div className="space-y-8">
                {/* Summary Cards */}
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

                {/* Bar Chart */}
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
            ) : (
              <>
                {/* Search Bar */}
                {activeSection !== "dashboard" && (
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder={`Search ${activeSection}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Users Section */}
                {activeSection === "users" && (
                  <DataTable
                    title="Users"
                    data={filterData(users, ["name", "email"])}
                    fields={["name", "email"]}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                )}

                {/* Vendors Section */}
                {activeSection === "vendors" && (
                  <DataTable
                    title="Vendors"
                    data={filterData(vendors, ["vendorName", "email", "isActive"])}
                    fields={["vendorName", "email", "isActive"]}
                    onEdit={handleEditVendor}
                    onDelete={handleDeleteVendor}
                  />
                )}

                {/* Admins Section */}
                {activeSection === "admins" && (
                  <DataTable
                    title="Admins"
                    data={filterData(admins, ["name", "email"])}
                    fields={["name", "email"]}
                    // No onEdit or onDelete passed for admins
                  />
                )}

                {/* Buses Section */}
                {activeSection === "buses" && (
                  <BusCards
                    buses={filterData(paginatedBuses, ["busName", "pickupPoint", "dropPoint"])}
                    loading={loading}
                  />
                )}

                {/* Vehicles Section */}
                {activeSection === "vehicles" && (
                  <VehicleCards
                    vehicles={filterData(paginatedVehicles, ["name", "type"])}
                    loading={loading}
                  />
                )}

                {/* Pagination */}
                {(activeSection === "buses" || activeSection === "vehicles") && (
                  <div className="flex justify-center mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`mx-1 px-4 py-2 rounded-md ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Skeleton Loader
const SkeletonLoader = ({ type }) => {
  if (type === "card") {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return null;
};

// Data Table Component
const DataTable = ({ title, data, fields, onEdit, onDelete }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
    <table className="w-full border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-blue-600 text-white">
          {fields.map((key) => (
            <th key={key} className="border border-gray-300 px-6 py-3">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </th>
          ))}
          {/* Conditionally render Actions column */}
          {(onEdit || onDelete) && (
            <th className="border border-gray-300 px-6 py-3">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border border-gray-300 bg-white">
            {fields.map((field, i) => (
              <td key={i} className="border border-gray-300 px-6 py-3">
                {String(item[field])}
              </td>
            ))}
            {/* Conditionally render action buttons */}
            {(onEdit || onDelete) && (
              <td className="border border-gray-300 px-6 py-3 flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Bus Cards Section
const BusCards = ({ buses, loading }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Buses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : buses.map((bus) => (
            <div
              key={bus._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={bus.image.startsWith("http") ? bus.image : `http://localhost:3001${bus.image}`}
                alt={bus.busName || "Bus Image"}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{bus.busName}</h3>
                <p className="text-gray-600">Price Per Seat: Rs. {bus.pricePerSeat}</p>
                <p className="text-gray-600">Pickup: {bus.pickupPoint}</p>
                <p className="text-gray-600">Drop: {bus.dropPoint}</p>
                <p className="text-gray-600">Total Seats: {bus.totalSeats}</p>
                <p className="text-gray-600">Booked Seats: {bus.bookedSeats?.length || 0}</p>
              </div>
            </div>
          ))}
    </div>
  </div>
);

// Vehicle Cards Section
const VehicleCards = ({ vehicles, loading }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vehicles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={vehicle.image.startsWith("http") ? vehicle.image : `http://localhost:3001${vehicle.image}`}
                alt={vehicle.name || "Vehicle Image"}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p className="text-gray-600">Type: {vehicle.type}</p>
                <p className="text-gray-600">Price: Rs. {vehicle.price}</p>
                <p className="text-gray-600">Availability: {vehicle.isAvailable ? "Available" : "Not Available"}</p>
              </div>
            </div>
          ))}
    </div>
  </div>
);

export default AdminDashboard;