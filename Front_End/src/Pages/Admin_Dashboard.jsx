import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";
import BusCards from "../Component/Admin_BusCards";
import VehicleCards from "../Component/Admin_VehicleCards";
import EditModal from "../Component/Admin_EditModal";
import DataTable from "../Component/Admin_DataTable";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [buses, setBuses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
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

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [editModal, setEditModal] = useState({
    isOpen: true,
    type: '',
    item: null,
    field: 'fieldtoEdit'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, vendorsRes, adminsRes, busesRes, vehiclesRes, bookingsRes] =
        await Promise.all([
          axios.get("http://localhost:3001/admin/dashboard/get-users", config),
          axios.get("http://localhost:3001/admin/dashboard/get-vendors", config),
          axios.get("http://localhost:3001/admin/dashboard/get-admins", config),
          axios.get("http://localhost:3001/api/buses?admin=true", config),
          axios.get("http://localhost:3001/api/vehicles?admin=true", config),
          axios.get("http://localhost:3001/admin/bookings", config)
        ]);
      
      setUsers(usersRes.data.users || []);
      setVendors(vendorsRes.data.vendors || []);
      setAdmins(adminsRes.data.admins || []);
      setBuses(busesRes.data.buses || busesRes.data.data || []);
      setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data.data || []);
      
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

  const toggleVendorStatus = async (vendorId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3001/admin/toggle-vendor/${vendorId}`,
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

  const dashboardData = [
    { name: "Users", count: users.length, color: "#3B82F6" },
    { name: "Vendors", count: vendors.length, color: "#10B981" },
    { name: "Admins", count: admins.length, color: "#F59E0B" },
    { name: "Buses", count: buses.length, color: "#8B5CF6" },
    { name: "Vehicles", count: vehicles.length, color: "#EF4444" },
    { name: "Bookings", count: bookings.length, color: "#EC4899" },
  ];

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

      {/* Sidebar - Mobile First */}
      <div className="md:hidden bg-white shadow-md">
        <select
          value={activeSection}
          onChange={(e) => {
            setActiveSection(e.target.value);
            setSearchQuery("");
            setCurrentPage(1);
          }}
          className="w-full p-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-56 lg:w-64 bg-white shadow-xl p-4 lg:p-6 border-r">
        <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-blue-700">Admin Dashboard</h2>
        <ul className="space-y-2 lg:space-y-3">
          {["dashboard", "users", "vendors", "admins", "buses", "vehicles", "bookings"].map(
            (section) => (
              <li
                key={section}
                className={`p-2 lg:p-3 cursor-pointer rounded-md transition-all ${
                  activeSection === section
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveSection(section);
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
              >
                <span className="text-sm lg:text-base">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </li>
            )
          )}
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

            {activeSection === "dashboard" ? (
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                  {dashboardData.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-lg transition-all"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      <h3 className="text-sm md:text-lg font-semibold text-gray-700">
                        {item.name}
                      </h3>
                      <p 
                        className="text-2xl md:text-3xl font-bold mt-1 md:mt-2" 
                        style={{ color: item.color }}
                      >
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Entity Distribution</h2>
                  <div className="h-64 md:h-80">
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
                <div className="mb-4 md:mb-6">
                  <input
                    type="text"
                    placeholder={`Search ${activeSection}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-md md:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {activeSection === "users" && (
                  <DataTable
                    title="Users"
                    data={filterData(users, ["name", "email"])}
                    fields={["name", "email"]}
                    headers={["Name", "Email"]}
                    renderCell={(item, field) => item[field]}
                    onEdit={(user) => handleEditClick(user, 'user')}
                    onDelete={handleDeleteUser}
                  />
                )}

                {activeSection === "vendors" && (
                  <DataTable
                    title="Vendors"
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
                )}

                {activeSection === "admins" && (
                  <DataTable
                    title="Admins"
                    data={filterData(admins, ["name", "email"])}
                    fields={["name", "email"]}
                    headers={["Name", "Email"]}
                    renderCell={(item, field) => item[field]}
                  />
                )}

                {activeSection === "buses" && (
                  <>
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
                  </>
                )}

                {activeSection === "vehicles" && (
                  <>
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
                  </>
                )}

{activeSection === "bookings" && (
  <>
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => setBookingType('bus')}
          className={`px-4 py-2 rounded-l-md ${bookingType === 'bus' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Bus Bookings
        </button>
        <button
          onClick={() => setBookingType('vehicle')}
          className={`px-4 py-2 rounded-r-md ${bookingType === 'vehicle' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Vehicle Bookings
        </button>
      </div>
      
      <BookingFilters bookingType={bookingType} />
    </div>

    <DataTable
  title={`${bookingType === 'bus' ? 'Bus' : 'Vehicle'} Bookings`}
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
        
      
      onDelete={handleCancelBooking}
      disableEdit={true}
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
  </>
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