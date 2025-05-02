import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";
import BusCards from "../Component/Admin_BusCards";
import VehicleCards from "../Component/Admin_VehicleCards";
import EditModal from "../Component/Admin_EditModal";
import DataTable from "../Component/Admin_DataTable";

const AdminDashboard = () => {
  // State management
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [buses, setBuses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingType, setBookingType] = useState('bus');
  const itemsPerPage = 6;
  
  const [filters, setFilters] = useState({
    status: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    busId: '',
    vehicleId: '',
    pickupPoint: '',
    dropPoint: ''
  });

  // Authentication and configuration
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [editModal, setEditModal] = useState({
    isOpen: false,
    type: '',
    item: null,
    field: ''
  });

  // Data fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        usersRes, 
        vendorsRes,  
        busesRes, 
        vehiclesRes, 
        bookingsRes,
        notificationsRes
      ] = await Promise.all([
        axios.get("http://localhost:3001/admin/dashboard/get-users", config),
        axios.get("http://localhost:3001/admin/dashboard/get-vendors", config),
        axios.get("http://localhost:3001/api/buses?admin=true", config),
        axios.get("http://localhost:3001/api/vehicles?admin=true", config),
        axios.get("http://localhost:3001/admin/bookings", config),
        axios.get("http://localhost:3001/admin/notifications", config)
      ]);
      
      setUsers(usersRes.data.users || []);
      setVendors(vendorsRes.data.vendors || []);
      setBuses(busesRes.data.buses || busesRes.data.data || []);
      setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data.data || []);
      setNotifications(notificationsRes.data.notifications || []);
      setUnreadCount(notificationsRes.data.unreadCount || 0);
      
      const formattedBookings = bookingsRes.data.bookings?.map(booking => ({
        ...booking,
        user: booking.userId,
        bus: booking.busId,
        vehicle: booking.vehicleId
      })) || [];
      
      setBookings(formattedBookings);
    } catch (error) {
      toast.error("Failed to load data. Please check your connection and try again.");
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Notification handling
  const markNotificationsAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:3001/admin/notifications/mark-as-read",
        {},
        config
      );
      setUnreadCount(0);
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  // User actions
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleVendorStatus = async (vendorId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3001/admin/vendor/${vendorId}/status`,
        {},
        config
      );
      toast.success(data.message || "Vendor status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update vendor status");
    }
  };
  
  

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/admin/delete-user/${userId}`,
        config
      );
      toast.success(data.message || "User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/admin/delete-vendor/${vendorId}`,
        config
      );
      toast.success(data.message || "Vendor deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vendor");
    }
  };

  // Edit modal handling
  const handleEditClick = (item, type, field = '') => {
    let fieldToEdit = field;
  
    if (!fieldToEdit) {
      fieldToEdit =
        type === 'user' ? 'name' :
        type === 'vendor' ? 'vendorName' :
        'status'; // default fallback
    }
  
    setEditModal({
      isOpen: true,
      type,
      item,
      field: fieldToEdit
    });
  };

  const handleSaveEdit = async (newValue) => {
    try {
      if (editModal.type === 'user') {
        await axios.put(
          `http://localhost:3001/admin/edit-user/${editModal.item._id}`,
          { name: newValue },
          config
        );
        toast.success("User updated successfully");
      } else if (editModal.type === 'vendor') {
        await axios.put(
          `http://localhost:3001/admin/edit-vendor/${editModal.item._id}`,
          { vendorName: newValue },
          config
        );
        toast.success("Vendor updated successfully");
      } else if (editModal.type === 'booking') {
        await axios.put(
          `http://localhost:3001/admin/bookings/${editModal.item._id}`,
          { status: newValue },
          config
        );
        toast.success("Booking status updated successfully");
      }
      fetchData();
      setEditModal({ isOpen: false, type: '', item: null, field: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  // Booking actions
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const { data } = await axios.put(
        `http://localhost:3001/admin/bookings/${bookingId}/cancel`,
        {},
        config
      );
      toast.success(data.message || "Booking cancelled successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // Data filtering and pagination
  const filterData = (data, fields) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      fields.some((field) => {
        const value = field.includes('.') ? 
          field.split('.').reduce((obj, key) => obj?.[key], item) :
          item[field];
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  };

  const filterBookings = (bookings, bookingType) => {
    return bookings.filter(booking => {
      if (filters.status && booking.status !== filters.status) return false;
      if (filters.minPrice && booking.totalPrice < Number(filters.minPrice)) return false;
      if (filters.maxPrice && booking.totalPrice > Number(filters.maxPrice)) return false;
      if (filters.startDate && new Date(booking.createdAt) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(booking.createdAt) > new Date(filters.endDate)) return false;

      if (bookingType === 'bus') {
        if (filters.busId && booking.busId !== filters.busId) return false;
      } else if (bookingType === 'vehicle') {
        if (filters.vehicleId && booking.vehicleId !== filters.vehicleId) return false;
        if (filters.pickupPoint && !booking.pickupPoint?.toLowerCase().includes(filters.pickupPoint.toLowerCase())) return false;
        if (filters.dropPoint && !booking.dropPoint?.toLowerCase().includes(filters.dropPoint.toLowerCase())) return false;
      }

      return true;
    });
  };

  const paginatedData = (data) => data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = (data) => Math.ceil(data.length / itemsPerPage);

  // Constants
  const sections = [
    "dashboard",
    "users",
    "vendors",
    "buses",
    "vehicles",
    "bookings",
  ];

  const dashboardData = [
    { name: "Users", count: users.length, color: "#3B82F6" },
    { name: "Vendors", count: vendors.length, color: "#10B981" },
    { name: "Buses", count: buses.length, color: "#8B5CF6" },
    { name: "Vehicles", count: vehicles.length, color: "#EF4444" },
    { name: "Bookings", count: bookings.length, color: "#EC4899" },
  ];

  // Components
  const BookingFilters = ({ bookingType }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-3">Filter Bookings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Min price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Max price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {bookingType === 'bus' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus</label>
              <select
                value={filters.busId}
                onChange={(e) => setFilters({...filters, busId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Buses</option>
                {buses.map(bus => (
                  <option key={bus._id} value={bus._id}>{bus.busName || `Bus ${bus._id}`}</option>
                ))}
              </select>
            </div>
          )}

          {bookingType === 'vehicle' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                <select
                  value={filters.vehicleId}
                  onChange={(e) => setFilters({...filters, vehicleId: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Vehicles</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>{vehicle.name || `Vehicle ${vehicle._id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Point</label>
                <input
                  type="text"
                  value={filters.pickupPoint}
                  onChange={(e) => setFilters({...filters, pickupPoint: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter pickup location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drop Point</label>
                <input
                  type="text"
                  value={filters.dropPoint}
                  onChange={(e) => setFilters({...filters, dropPoint: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter drop location"
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({
              status: '',
              minPrice: '',
              maxPrice: '',
              startDate: '',
              endDate: '',
              busId: '',
              vehicleId: '',
              pickupPoint: '',
              dropPoint: ''
            })}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  };

  // Main render
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

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, type: '', item: null, field: '' })}
        title={`Edit ${editModal.type === 'user' ? 'User' : 
               editModal.type === 'vendor' ? 'Vendor' : 'Booking'}`}
        initialValue={editModal.item ? editModal.item[editModal.field] : ''}
        onSave={handleSaveEdit}
        fieldName={editModal.field === 'name' ? 'Name' : 
                 editModal.field === 'vendorName' ? 'Vendor Name' : 'Status'}
      />

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white shadow-md">
        <select
          value={activeSection}
          onChange={(e) => {
            setActiveSection(e.target.value);
            setSearchQuery("");
            setCurrentPage(1);
            if (e.target.value === "notifications") {
              markNotificationsAsRead();
            }
          }}
          className="w-full p-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sections.map((section) => (
            <option key={section} value={section}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
              {section === "notifications" && unreadCount > 0 && ` (${unreadCount})`}
            </option>
          ))}
        </select>
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 bg-white shadow-xl p-4 lg:p-6 border-r">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-blue-700">Admin Dashboard</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <ul className="space-y-2 lg:space-y-3">
          {sections.map((section) => (
            <li
              key={section}
              className={`p-2 lg:p-3 cursor-pointer rounded-md transition-all flex justify-between items-center ${
                activeSection === section
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveSection(section);
                setSearchQuery("");
                setCurrentPage(1);
                if (section === "notifications") {
                  markNotificationsAsRead();
                }
              }}
            >
              <span className="text-sm lg:text-base">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
              {section === "notifications" && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </li>
          ))}
          <li
            className="p-2 lg:p-3 cursor-pointer rounded-md transition-all hover:bg-red-100 hover:text-red-700"
            onClick={handleLogout}
          >
            <span className="text-sm lg:text-base">Logout</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 md:p-4 bg-red-100 text-red-600 rounded-lg mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2">
                <p className="text-sm md:text-base">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm md:text-base"
                >
                  Retry
                </button>
              </div>
            )}

            {activeSection === "dashboard" && (
              <div className="space-y-6 md:space-y-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {dashboardData.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4"
                      style={{ borderColor: item.color }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold text-gray-700">
                        {item.name}
                      </h3>
                      <p className="text-2xl md:text-3xl font-bold mt-2" style={{ color: item.color }}>
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={bookings.slice(0, 10).map(booking => ({
                          ...booking,
                          date: new Date(booking.createdAt).toLocaleDateString()
                        }))}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalPrice" fill="#8884d8" name="Booking Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <p><span className="font-medium">Name:</span> {decodedToken?.name || "Admin User"}</p>
                        <p><span className="font-medium">Email:</span> {decodedToken?.email}</p>
                        <p><span className="font-medium">Role:</span> Administrator</p>
                        <p><span className="font-medium">Last Login:</span> {new Date(decodedToken?.iat * 1000).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-xl font-bold">{users.length}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-600">Active Vendors</p>
                          <p className="text-xl font-bold">{vendors.filter(v => v.isActive).length}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-600">Today's Bookings</p>
                          <p className="text-xl font-bold">
                            {bookings.filter(b => 
                              new Date(b.createdAt).toDateString() === new Date().toDateString()
                            ).length}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-600">Unread Notifications</p>
                          <p className="text-xl font-bold">{unreadCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Notifications</h2>
                  <button 
                    onClick={() => fetchData()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Refresh
                  </button>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification._id} 
                        className={`border-l-4 p-4 rounded shadow-sm ${
                          notification.read ? 'border-gray-300 bg-white' : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700">{notification.message}</p>
                        {notification.link && (
                          <a 
                            href={notification.link} 
                            className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                          >
                            View details
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "users" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Users</h2>
                  <div className="w-64">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <DataTable
                  data={filterData(users, ["name", "email"])}
                  fields={["name", "email"]}
                  headers={["Name", "Email"]}
                  renderCell={(item, field) => item[field]}
                  onEdit={(user) => handleEditClick(user, 'user')}
                  onDelete={handleDeleteUser}
                />
              </div>
            )}

            {activeSection === "vendors" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Vendors</h2>
                  <div className="w-64">
                    <input
                      type="text"
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <DataTable
                  data={filterData(vendors, ["vendorName", "email", "isActive"])}
                  fields={["vendorName", "email", "isActive"]}
                  headers={["Vendor Name", "Email", "Active Status"]}
                  renderCell={(item, field) => 
                    field === "isActive" ? (item[field] ? "Active" : "Inactive") : item[field]
                  }
                  onEdit={(vendor) => handleEditClick(vendor, 'vendor')}
                  onDelete={handleDeleteVendor}
                  onToggleStatus={toggleVendorStatus}
                />
              </div>
            )}

            {activeSection === "buses" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Buses</h2>
                  <div className="w-64">
                    <input
                      type="text"
                      placeholder="Search buses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <BusCards
                  buses={filterData(paginatedData(buses), ["busName", "pickupPoint", "dropPoint"])}
                  loading={loading}
                />
                {buses.length > itemsPerPage && (
                  <div className="flex justify-center mt-4 md:mt-6 flex-wrap gap-1">
                    {Array.from({ length: totalPages(buses) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base ${
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
              </div>
            )}

            {activeSection === "vehicles" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Vehicles</h2>
                  <div className="w-64">
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <VehicleCards
                  vehicles={filterData(paginatedData(vehicles), ["name"])}
                  loading={loading}
                />
                {vehicles.length > itemsPerPage && (
                  <div className="flex justify-center mt-4 md:mt-6 flex-wrap gap-1">
                    {Array.from({ length: totalPages(vehicles) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base ${
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
              </div>
            )}

            {activeSection === "bookings" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Bookings</h2>
                  <div className="flex items-center">
                    <div className="w-64 mr-4">
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => setBookingType('bus')}
                        className={`px-4 py-2 rounded-l-md ${bookingType === 'bus' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        Bus
                      </button>
                      <button
                        onClick={() => setBookingType('vehicle')}
                        className={`px-4 py-2 rounded-r-md ${bookingType === 'vehicle' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        Vehicle
                      </button>
                    </div>
                  </div>
                </div>
                
                <BookingFilters bookingType={bookingType} />
                
                <DataTable
                  data={paginatedData(filterBookings(
                    bookings.filter(b => bookingType === 'bus' ? b.bus : b.vehicle),
                    bookingType
                  ))}
                  fields={bookingType === 'bus' ? 
                    ["_id", "user", "bus", "selectedSeats", "totalPrice", "status", "createdAt"] : 
                    ["_id", "user", "vehicle", "pickupPoint", "dropPoint", "totalPrice", "status", "createdAt"]}
                  headers={bookingType === 'bus' ? 
                    ["Booking ID", "User", "Bus", "Seats", "Price", "Status", "Date"] : 
                    ["Booking ID", "User", "Vehicle", "Pickup", "Drop", "Price", "Status", "Date"]}
                  renderCell={(item, field) => {
                    if (field === "createdAt") {
                      return new Date(item[field]).toLocaleString();
                    }
                    if (field === "user") {
                      return item.user?.name || "N/A";
                    }
                    if (field === "bus") {
                      return item.bus?.busName || "N/A";
                    }
                    if (field === "vehicle") {
                      return item.vehicle?.name || "N/A";
                    }
                    if (field === "totalPrice") {
                      return `$${item[field]}`;
                    }
                    return item[field];
                  }}
                  onEdit={(booking) => handleEditClick(booking, 'booking', 'status')}
                  onDelete={handleCancelBooking}
                />

                {bookings.length > itemsPerPage && (
                  <div className="flex justify-center mt-4 md:mt-6 flex-wrap gap-1">
                    {Array.from({ length: totalPages(bookings) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base ${
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
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;