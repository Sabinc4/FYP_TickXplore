import { useState, type ReactElement } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiGrid, FiUsers, FiBriefcase, FiList, FiTruck, FiBookOpen, FiRefreshCw } from "react-icons/fi";
import useAdminData from "../../hooks/useAdminData";
import type { Bus, Booking, RefundRequest, User, Vendor, Vehicle } from "../../api";

export interface AdminOutletContext {
  users: User[];
  vendors: Vendor[];
  buses: Bus[];
  vehicles: Vehicle[];
  bookings: Booking[];
  refundRequests: RefundRequest[];
  dashboardData: { name: string; count: number; color: string }[];
  handleEditClick: (item: unknown, type: string, field?: string) => void;
  handleDeleteUser: (id: string) => void;
  handleDeleteVendor: (id: string) => void;
  toggleVendorStatus: (id: string) => void;
  loading: boolean;
  error: string;
  fetchData: () => void;
}

const SECTIONS: { label: string; path: string; icon: ReactElement }[] = [
  { label: "Dashboard", path: "", icon: <FiGrid /> },
  { label: "Users", path: "users", icon: <FiUsers /> },
  { label: "Vendors", path: "vendors", icon: <FiBriefcase /> },
  { label: "Buses", path: "buses", icon: <FiList /> },
  { label: "Vehicles", path: "vehicles", icon: <FiTruck /> },
  { label: "Bookings", path: "bookings", icon: <FiBookOpen /> },
  { label: "Refunds", path: "refunds", icon: <FiRefreshCw /> },
];

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    users,
    vendors,
    buses,
    vehicles,
    bookings,
    refundRequests,
    dashboardData,
    handleEditClick,
    handleDeleteUser,
    handleDeleteVendor,
    toggleVendorStatus,
    loading,
    error,
    fetchData,
  } = useAdminData();

  const isActive = (path: string) =>
    (path === "" && location.pathname === "/Admin_Dashboard") ||
    (path !== "" && location.pathname.startsWith(`/Admin_Dashboard/${path}`));

  const context: AdminOutletContext = {
    users,
    vendors,
    buses,
    vehicles,
    bookings,
    refundRequests,
    dashboardData,
    handleEditClick,
    handleDeleteUser,
    handleDeleteVendor,
    toggleVendorStatus,
    loading,
    error,
    fetchData,
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="relative flex h-16 shrink-0 items-center border-b border-gray-800 bg-gray-900 px-4 text-white shadow-sm">
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="rounded-md bg-gray-800 p-2 text-white hover:bg-gray-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-wide md:text-xl">
          Admin Dashboard
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-700 bg-gray-800 text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="w-full p-4">
            <ul className="space-y-2">
              {SECTIONS.map(({ label, path, icon }) => (
                <li key={path || "dashboard"}>
                  <Link
                    to={path === "" ? "/Admin_Dashboard" : `/Admin_Dashboard/${path}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive(path)
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className="inline-flex">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet context={context} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;