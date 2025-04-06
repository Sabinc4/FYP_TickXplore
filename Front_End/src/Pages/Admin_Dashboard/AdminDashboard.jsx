import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAdminData from '../../hooks/useAdminData';


const AdminDashboard = () => {
  const location = useLocation();
  const {
    users, vendors, admins, buses, vehicles, bookings,
    dashboardData, handleEditClick, handleDeleteUser, 
    handleDeleteVendor, toggleVendorStatus, loading, error
  } = useAdminData();

  const isActive = (path) => {
    return location.pathname.startsWith(`/Admin_Dashboard/${path}`) || 
           (path === 'dashboard' && location.pathname === '/Admin_Dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Mobile Sidebar */}
      <div className="md:hidden bg-white shadow-md">
        <select
          onChange={(e) => window.location.href = `/Admin_Dashboard/${e.target.value}`}
          className="w-full p-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={
            location.pathname === '/Admin_Dashboard' ? 'dashboard' : 
            location.pathname.split('/')[2] || 'dashboard'
          }
        >
          {["dashboard", "users", "vendors", "admins", "buses", "vehicles", "bookings"].map(
            (section) => (
              <option key={section} value={section}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </option>
            )
          )}
        </select>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 bg-white shadow-xl p-4 lg:p-6 border-r">
        <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-blue-700">Admin Dashboard</h2>
        <ul className="space-y-2 lg:space-y-3">
          {["dashboard", "users", "vendors", "admins", "buses", "vehicles", "bookings"].map(
            (section) => (
              <li
                key={section}
                className={`p-2 lg:p-3 cursor-pointer rounded-md transition-all ${
                  isActive(section)
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-200"
                }`}
              >
                <Link 
                  to={section === 'dashboard' ? '/Admin_Dashboard' : `/Admin_Dashboard/${section}`}
                  className="text-sm lg:text-base"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              </li>
            )
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <Outlet context={{
          users, vendors, admins, buses, vehicles, bookings,
          dashboardData, handleEditClick, handleDeleteUser,
          handleDeleteVendor, toggleVendorStatus, loading, error
        }} />
      </main>
    </div>
  );
};

export default AdminDashboard;