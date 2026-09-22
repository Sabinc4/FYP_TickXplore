import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { adminApi, type Bus, type User, type Vehicle, type Booking, type RefundRequest, type Vendor } from "../api";

interface DashboardItem {
  name: string;
  count: number;
  color: string;
}

const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getDashboard();
      setUsers(data.users || []);
      setVendors(data.vendors || []);
      setAdmins(data.admins || []);
      setBuses(data.buses || []);
      setVehicles(data.vehicles || []);
      setBookings(data.bookings || []);
      setRefundRequests(data.refundRequests || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data. Please check your connection and try again.");
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleVendorStatus = async (vendorId: string) => {
    const toastId = toast.loading("Updating vendor status...");
    try {
      const data = await adminApi.toggleVendor(vendorId);
      toast.update(toastId, {
        render:
          (data as { message?: string }).message ||
          "Vendor status updated successfully",
        type: "success",
        isLoading: false,
      });
      fetchData();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      toast.update(toastId, {
        render:
          axiosErr.response?.data?.message || "Failed to update vendor status",
        type: "error",
        isLoading: false,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const data = await adminApi.deleteUser(userId);
      toast.success((data as { message?: string }).message || "User deleted successfully");
      fetchData();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      const data = await adminApi.deleteVendor(vendorId);
      toast.success((data as { message?: string }).message || "Vendor deleted successfully");
      fetchData();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to delete vendor");
    }
  };

  const handleEditClick = (item: unknown, type: string, field = "") => {
    console.log(`Editing ${type} field: ${field}`, item);
  };

  const dashboardData: DashboardItem[] = [
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
    handleEditClick, handleDeleteUser, handleDeleteVendor, toggleVendorStatus,
  };
};

export default useAdminData;