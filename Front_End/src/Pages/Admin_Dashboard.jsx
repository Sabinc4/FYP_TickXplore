import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ users: 0, vendors: 0, admins: 0, buses: 0, vehicles: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, vendorsRes, adminsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:3001/admin/get-users"),
        axios.get("http://localhost:3001/admin/get-vendors"),
        axios.get("http://localhost:3001/admin/get-admins"),
        axios.get("http://localhost:3001/admin/get-stats"),
      ]);

      setUsers(usersRes.data.users || []);
      setVendors(vendorsRes.data.vendors || []);
      setAdmins(adminsRes.data.admins || []);
      setStats(statsRes.data || { users: 0, vendors: 0, admins: 0, buses: 0, vehicles: 0 });

      console.log("Users:", usersRes.data);
      console.log("Vendors:", vendorsRes.data);
      console.log("Admins:", adminsRes.data);
      console.log("Stats:", statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    }
  };

  // Delete User
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3001/admin/delete-user/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  //Delete Vendor
  const deleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await axios.delete(`http://localhost:3001/admin/delete-vendor/${vendorId}`);
      setVendors(vendors.filter(vendor => vendor._id !== vendorId));
      toast.success("Vendor deleted successfully");
    } catch (error) {
      toast.error("Error deleting vendor");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
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
                  <h3 className="text-lg font-bold">{value}</h3>
                  <p className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <div className="bg-white p-4 shadow rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">Users</h1>
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user._id} className="border-b">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <button onClick={() => deleteUser(user._id)} className="bg-red-500 px-3 py-1 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-3 text-center text-gray-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Admins Section */}
        {activeSection === "admins" && (
          <div className="bg-white p-4 shadow rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">Admins</h1>
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map(admin => (
                    <tr key={admin._id} className="border-b">
                      <td className="p-3">{admin.name}</td>
                      <td className="p-3">{admin.email}</td>
                      <td className="p-3">
                        <button onClick={() => deleteAdmin(admin._id)} className="bg-red-500 px-3 py-1 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 p-4">No admin found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length > 0 ? (
                  vendors.map(vendor => (
                    <tr key={vendor._id} className="border-b">
                      <td className="p-3">{vendor.vendorName}</td>
                      <td className="p-3">{vendor.email}</td>
                      <td className="p-3">{vendor.vendorLocation}</td>
                      <td className="p-3">
                        <button onClick={() => deleteVendor(vendor._id)} className="bg-red-500 px-3 py-1 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-500">No vendors found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
