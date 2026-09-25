import { useState, type ReactElement } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMenu, FiX, FiGrid, FiUsers, FiBriefcase, FiList, FiTruck, FiBookOpen, FiRefreshCw, FiUserPlus, FiUserCheck, FiLogOut } from "react-icons/fi";
import useAdminData from "../../hooks/useAdminData";
import LogoutConfirmModal from "../../Component/LogoutConfirmModal";
import type { Bus, Booking, RefundRequest, User, Vendor, Vehicle } from "../../api";

export interface AdminOutletContext {
  users: User[];
  vendors: Vendor[];
  vendorApplications: Vendor[];
  admins: User[];
  buses: Bus[];
  vehicles: Vehicle[];
  bookings: Booking[];
  refundRequests: RefundRequest[];
  dashboardData: { name: string; count: number; color: string }[];
  handleDeleteUser: (id: string) => void;
  handleDeleteVendor: (id: string) => void;
  handleDeleteAdmin: (id: string) => void;
  toggleVendorStatus: (id: string) => void;
  approveVendor: (id: string) => void;
  declineVendor: (id: string) => void;
  loading: boolean;
  error: string;
  fetchData: () => void;
}

const SECTIONS: { label: string; path: string; icon: ReactElement }[] = [
  { label: "Dashboard", path: "", icon: <FiGrid /> },
  { label: "Users", path: "users", icon: <FiUsers /> },
  { label: "Vendor Applications", path: "vendor-applications", icon: <FiUserPlus /> },
  { label: "Vendors", path: "vendors", icon: <FiBriefcase /> },
  { label: "Admins", path: "admins", icon: <FiUserCheck /> },
  { label: "Buses", path: "buses", icon: <FiList /> },
  { label: "Vehicles", path: "vehicles", icon: <FiTruck /> },
  { label: "Bookings", path: "bookings", icon: <FiBookOpen /> },
  { label: "Refunds", path: "refunds", icon: <FiRefreshCw /> },
];

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userName = localStorage.getItem("userName") || "Admin";

  const confirmLogout = () => {
    toast.dismiss();
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/sign-in");
    window.dispatchEvent(new Event("storageUpdate"));
  };
  const {
    users,
    vendors,
    vendorApplications,
    admins,
    buses,
    vehicles,
    bookings,
    refundRequests,
    dashboardData,
    handleDeleteUser,
    handleDeleteVendor,
    handleDeleteAdmin,
    toggleVendorStatus,
    approveVendor,
    declineVendor,
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
    vendorApplications,
    admins,
    buses,
    vehicles,
    bookings,
    refundRequests,
    dashboardData,
    handleDeleteUser,
    handleDeleteVendor,
    handleDeleteAdmin,
    toggleVendorStatus,
    approveVendor,
    declineVendor,
    loading,
    error,
    fetchData,
  };

  return (
    <div className="flex h-screen flex-col bg-slate-200">
      <header className="relative flex h-16 shrink-0 items-center justify-between gap-3 border-b-2 border-indigo-600 bg-white px-4 text-slate-900 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className="rounded-md bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <h1 className="truncate text-lg font-semibold tracking-wide md:text-xl">
            Admin Dashboard
          </h1>
        </div>

        <span className="min-w-0 truncate text-sm text-slate-600">
          Welcome, <span className="font-medium text-indigo-600">{userName}</span>
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-indigo-100 bg-indigo-50 text-slate-700 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="w-full p-4">
            <ul className="space-y-1">
              {SECTIONS.map(({ label, path, icon }) => (
                <li key={path || "dashboard"}>
                  <Link
                    to={path === "" ? "/Admin_Dashboard" : `/Admin_Dashboard/${path}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg border-l-4 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive(path)
                        ? "border-indigo-600 bg-indigo-600 font-semibold text-white"
                        : "border-transparent text-slate-600 hover:bg-indigo-100/60 hover:text-slate-900"
                    }`}
                  >
                    <span className="inline-flex">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto w-full border-t border-indigo-100 p-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center gap-3 rounded-lg border-l-4 border-transparent px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet context={context} />
        </main>
      </div>

      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default AdminDashboard;