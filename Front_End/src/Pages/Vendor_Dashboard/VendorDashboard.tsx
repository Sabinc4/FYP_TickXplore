import { useState, useEffect, useCallback, type ReactElement } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiGrid, FiTruck, FiList, FiBookOpen, FiLogOut } from "react-icons/fi";
import { vendorApi, type Booking, type Bus, type Vehicle } from "../../api";
import LogoutConfirmModal from "../../Component/LogoutConfirmModal";

interface VendorData {
  vehicles: Vehicle[];
  buses: Bus[];
  bookings: Booking[];
  loading: boolean;
  error: string;
  sidebarOpen: boolean;
}

interface SummaryCard {
  name: string;
  count: number | string;
  color: string;
}

interface BookingStatusItem {
  name: string;
  value: number;
  color: string;
}

interface VendorOutletContext {
  vehicles: Vehicle[];
  buses: Bus[];
  bookings: Booking[];
  loading: boolean;
  error: string;
  fetchData: () => void;
}

const VendorDashboard = () => {
  const [data, setData] = useState<VendorData>({
    vehicles: [],
    buses: [],
    bookings: [],
    loading: true,
    error: "",
    sidebarOpen: false,
  });

  const vendorId = localStorage.getItem("vendorId") || "";
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userName = localStorage.getItem("userName") || "Vendor";

  const confirmLogout = () => {
    toast.dismiss();
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/sign-in");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  const fetchData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: "" }));

      const result = await vendorApi.getDashboard(vendorId);

      const newData: VendorData = {
        vehicles: result.vehicles || [],
        buses: result.buses || [],
        bookings: result.bookings || [],
        loading: false,
        error: "",
        sidebarOpen: false,
      };

      setData(newData);

      if (
        newData.vehicles.length === 0 &&
        newData.buses.length === 0 &&
        newData.bookings.length === 0
      ) {
        toast.info("No vehicles, buses, or bookings found.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data.", { position: "top-right", autoClose: 5000 });
      setData((prev) => ({
        ...prev,
        error: "Failed to load data.",
        loading: false,
      }));
    }
  }, [vendorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalEarnings = data.bookings
    .filter((b) => b.status === "Booked")
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const summaryCards: SummaryCard[] = [
    { name: "Vehicles", count: data.vehicles.length, color: "#3B82F6" },
    { name: "Buses", count: data.buses.length, color: "#10B981" },
    { name: "Bookings", count: data.bookings.length, color: "#F59E0B" },
    { name: "Earnings", count: `NPR ${totalEarnings.toLocaleString()}`, color: "#6366F1" },
  ];

  const colorMap: Record<string, string> = {
    Booked: "#10B981",
    Pending: "#F59E0B",
    Cancelled: "#EF4444",
  };

  const bookingsByStatus: BookingStatusItem[] = ["Booked", "Pending", "Cancelled"].map(
    (status) => ({
      name: status,
      value: data.bookings.filter((b) => b.status === status).length,
      color: colorMap[status],
    })
  );

  const navLinks: { label: string; path: string; icon: ReactElement }[] = [
    { label: "Dashboard", path: "/VendorDashboard", icon: <FiGrid /> },
    { label: "Vehicles", path: "/VendorDashboard/vehicles", icon: <FiTruck /> },
    { label: "Buses", path: "/VendorDashboard/buses", icon: <FiList /> },
    { label: "Bookings", path: "/VendorDashboard/bookings", icon: <FiBookOpen /> },
  ];

  const toggleSidebar = () =>
    setData((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));

  const context: VendorOutletContext = {
    vehicles: data.vehicles,
    buses: data.buses,
    bookings: data.bookings,
    loading: data.loading,
    error: data.error,
    fetchData,
  };

  return (
    <div className="flex h-screen flex-col bg-slate-200">
      <header className="relative flex h-16 shrink-0 items-center justify-between gap-3 border-b-2 border-indigo-600 bg-white px-4 text-gray-900 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-md bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Toggle menu"
          >
            {data.sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <h1 className="truncate text-lg font-semibold tracking-wide md:text-xl">
            Vendor Portal
          </h1>
        </div>

        <span className="min-w-0 truncate text-sm text-gray-600">
          Welcome, <span className="font-medium text-indigo-600">{userName}</span>
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-indigo-100 bg-indigo-50 text-slate-700 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            data.sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="w-full p-4">
            <ul className="space-y-2">
              {navLinks.map(({ label, path, icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setData((prev) => ({ ...prev, sidebarOpen: false }))}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-indigo-100/60 hover:text-indigo-900"
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {data.loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-300/70" />
            ))}
          </div>
        ) : (
          <>
            {data.error && (
              <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-rose-100 p-4 text-rose-700 sm:flex-row">
                <p>{data.error}</p>
                <button
                  onClick={fetchData}
                  className="rounded-md bg-rose-600 px-4 py-2 text-white transition-colors hover:bg-rose-700"
                >
                  Retry
                </button>
              </div>
            )}

            <Outlet context={context} />

            {location.pathname === "/VendorDashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                  {summaryCards.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl bg-white p-4 shadow-card transition-all hover:shadow-card-lg md:p-6"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      <h3 className="text-base font-semibold text-gray-700 md:text-lg">
                        {item.name}
                      </h3>
                      <p
                        className="mt-2 text-2xl font-bold md:text-3xl"
                        style={{ color: item.color }}
                      >
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-card md:p-6">
                    <h2 className="mb-4 text-lg font-semibold md:text-xl">
                      Entity Distribution
                    </h2>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={summaryCards.filter((d) => d.name !== "Earnings")}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="count"
                            name="Total Count"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-card md:p-6">
                    <h2 className="mb-4 text-lg font-semibold md:text-xl">
                      Booking Status
                    </h2>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bookingsByStatus}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, value }: { name?: string; value?: number | string }) =>
                              Number(value) > 0 ? `${name}: ${value}` : ""
                            }
                          >
                            {bookingsByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
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

export default VendorDashboard;