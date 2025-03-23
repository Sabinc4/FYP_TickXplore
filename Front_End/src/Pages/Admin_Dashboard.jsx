import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../Component/DataTable";
import BusCards from "../Component/BusCards";
import VehicleCards from "../Component/VehicleCards";

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
      toast.error("User name cannot be empty.");
      return;
    }

    axios
      .put(`http://localhost:3001/admin/edit-user/${user._id}`, { name: updatedName })
      .then((response) => {
        console.log("User updated:", response.data);
        toast.success(response.data.message);
        fetchData();
      })
      .catch((error) => {
        console.error("Failed to update user:", error.response ? error.response.data : error);
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

  const paginatedBuses = buses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedVehicles = vehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(buses.length / itemsPerPage);

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
                  setSearchQuery("");
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

            {activeSection === "dashboard" ? (
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
            ) : (
              <>
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

                {activeSection === "users" && (
                  <DataTable
                    title="Users"
                    data={filterData(users, ["name", "email"])}
                    fields={["name", "email"]}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                )}

                {activeSection === "vendors" && (
                  <DataTable
                    title="Vendors"
                    data={filterData(vendors, ["vendorName", "email", "isActive"])}
                    fields={["vendorName", "email", "isActive"]}
                    onEdit={handleEditVendor}
                    onDelete={handleDeleteVendor}
                  />
                )}

                {activeSection === "admins" && (
                  <DataTable
                    title="Admins"
                    data={filterData(admins, ["name", "email"])}
                    fields={["name", "email"]}
                  />
                )}

                {activeSection === "buses" && (
                  <BusCards
                    buses={filterData(paginatedBuses, ["busName", "pickupPoint", "dropPoint"])}
                    loading={loading}
                  />
                )}

                {activeSection === "vehicles" && (
                  <VehicleCards
                    vehicles={filterData(paginatedVehicles, ["name", "type"])}
                    loading={loading}
                  />
                )}

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

export default AdminDashboard;