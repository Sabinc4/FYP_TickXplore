import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ users: null, vendors: null, admins: null, buses: null, vehicles: null });

  useEffect(() => {
    // Fetch Users
    axios.get("http://localhost:3001/admin/get-users")
      .then(res => setUsers(res.data.users))
      .catch(() => setUsers([]));

    // Fetch Vendors
    axios.get("http://localhost:3001/admin/get-vendors")
      .then(res => setVendors(res.data.vendors))
      .catch(() => setVendors([]));

    // ✅ Corrected Fetch Admins
    axios.get("http://localhost:3001/admin/get-admins")
      .then(res => setAdmins(res.data.admins))
      .catch(() => setAdmins([]));

    // Fetch Stats
    axios.get("http://localhost:3001/admin/get-stats")
      .then(res => setStats(res.data))
      .catch(() => setStats({ users: null, vendors: null, admins: null, buses: null, vehicles: null }));
  }, []);

  // ✅ Toggle Vendor Active/Inactive
  const toggleVendorStatus = async (vendorId) => {
    try {
      const response = await axios.put(`http://localhost:3001/admin/toggle-vendor/${vendorId}`);
      alert(response.data.message);
      setVendors(prevVendors =>
        prevVendors.map(vendor =>
          vendor._id === vendorId ? { ...vendor, isActive: !vendor.isActive } : vendor
        )
      );
    } catch (error) {
      alert("Error updating vendor status");
    }
  };

  // ✅ Delete User
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3001/admin/delete-user/${userId}`);
        alert("User deleted successfully");
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  // ✅ Delete Vendor
  const deleteVendor = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`http://localhost:3001/admin/delete-vendor/${vendorId}`);
        alert("Vendor deleted successfully");
        setVendors(vendors.filter(vendor => vendor._id !== vendorId));
      } catch (error) {
        alert("Error deleting vendor");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 border-r">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          {["dashboard", "users", "vendors", "admins", "bookings", "buses", "vehicles", "availability", "tickets", "routes"].map(section => (
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
        {activeSection === "dashboard" && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="bg-white p-4 shadow rounded-lg text-center">
                  <h3 className="text-lg font-bold">{value !== null ? value : "N/A"}</h3>
                  <p className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Vendors Section */}
        {activeSection === "vendors" && (
          <div className="bg-white p-4 shadow rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">Vendors</h1>
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Vendor Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor._id} className="border-b">
                    <td className="p-3">{vendor.vendorName}</td>
                    <td className="p-3">{vendor.email}</td>
                    <td className="p-3">{vendor.vendorLocation}</td>
                    <td className="p-3">{vendor.isActive ? "Active" : "Inactive"}</td>
                    <td className="p-3 flex space-x-2">
                      <button onClick={() => toggleVendorStatus(vendor._id)} className="bg-blue-500 px-3 py-1 text-white rounded">Toggle</button>
                      <button onClick={() => deleteVendor(vendor._id)} className="bg-red-500 px-3 py-1 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
