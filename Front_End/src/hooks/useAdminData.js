import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [buses, setBuses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        usersRes, vendorsRes, adminsRes, 
        busesRes, vehiclesRes, bookingsRes, refundRes
      ] = await Promise.all([
        axios.get("http://localhost:3001/admin/dashboard/get-users", config),
        axios.get("http://localhost:3001/admin/dashboard/get-vendors", config),
        axios.get("http://localhost:3001/admin/dashboard/get-admins", config),
        axios.get("http://localhost:3001/api/buses?admin=true", config),
        axios.get("http://localhost:3001/api/vehicles?admin=true", config),
        axios.get("http://localhost:3001/admin/bookings", config),
        axios.get("http://localhost:3001/api/refunds/admin/refund-requests", config)
      ]);

      setUsers(usersRes.data.users || []);
      setVendors(vendorsRes.data.vendors || []);
      setAdmins(adminsRes.data.admins || []);
      setBuses(busesRes.data.buses || busesRes.data.data || []);
      setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data.data || []);
      setBookings(bookingsRes.data.bookings || []);
      setRefundRequests(refundRes.data || []);
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
    console.log(`Editing ${type} field: ${field}`, item);
  };

  const dashboardData = [
    { name: "Users", count: users.length, color: "#3B82F6" },
    { name: "Vendors", count: vendors.length, color: "#10B981" },
    { name: "Admins", count: admins.length, color: "#F59E0B" },
    { name: "Buses", count: buses.length, color: "#8B5CF6" },
    { name: "Vehicles", count: vehicles.length, color: "#EF4444" },
    { name: "Bookings", count: bookings.length, color: "#EC4899" },
    { name: "Refunds", count: refundRequests.length, color: "#F97316" },
  ];

  return {
    users, vendors, admins, buses, vehicles, bookings, refundRequests,
    dashboardData, loading, error, fetchData,
    handleEditClick, handleDeleteUser, handleDeleteVendor, toggleVendorStatus
  };
};

export default useAdminData;
