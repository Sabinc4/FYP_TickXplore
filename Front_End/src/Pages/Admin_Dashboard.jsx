import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [buses, setBuses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ users: 0, vendors: 0, admins: 0, buses: 0, vehicles: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ Optimized Data Fetching
  const fetchData = useCallback(async (section) => {
    setLoading(true);
    try {
      const apiMap = {
        users: "/admin/get-users",
        vendors: "/admin/get-vendors",
        admins: "/admin/get-admins",
        buses: "/api/buses",
        vehicles: "/api/vehicles",
        dashboard: "/admin/get-stats",
      };

      if (apiMap[section]) {
        const response = await axios.get(`http://localhost:3001${apiMap[section]}`);
        const data = response.data;

        if (section === "dashboard") setStats(data);
        else if (section === "users") setUsers(data.users || []);
        else if (section === "vendors") setVendors(data.vendors || []);
        else if (section === "admins") setAdmins(data.admins || []);
        else if (section === "buses") setBuses(data.buses || []);
        else if (section === "vehicles") setVehicles(data.vehicles || []);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeSection);
  }, [activeSection, fetchData]);

  // ✅ Delete Function
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await axios.delete(`http://localhost:3001/admin/delete-${type}/${id}`);
      if (type === "bus") setBuses((prev) => prev.filter((bus) => bus._id !== id));
      if (type === "vehicle") setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    } catch (error) {
      toast.error(`Error deleting ${type}`);
    }
  };

  // ✅ Filter Data by Search
  const filteredData = useMemo(() => {
    const dataMap = {
      users: users || [],
      vendors: vendors || [],
      admins: admins || [],
      buses: buses || [],
      vehicles: vehicles || [],
    };

    return search
      ? dataMap[activeSection].filter((item) =>
          item.name?.toLowerCase().includes(search.toLowerCase())
        )
      : dataMap[activeSection];
  }, [search, activeSection, users, vendors, admins, buses, vehicles]);

  // ✅ Paginate Data
  const paginatedData = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />

      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 border-r">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          {["dashboard", "users", "vendors", "admins", "buses", "vehicles"].map((section) => (
            <li
              key={section}
              className={`p-3 cursor-pointer rounded-md ${
                activeSection === section ? "bg-blue-500 text-white" : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <>
            {activeSection === "dashboard" && <DashboardStats stats={stats} />}
            {["buses", "vehicles"].includes(activeSection) && (
              <BusVehicleCards
                title={activeSection === "buses" ? "Buses" : "Vehicles"}
                data={paginatedData}
                onDelete={handleDelete}
                type={activeSection}
                search={search}
                setSearch={setSearch}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ✅ Dashboard Stats Component
const DashboardStats = ({ stats }) => (
  <>
    <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-white p-4 shadow rounded-lg text-center">
          <h3 className="text-lg font-bold">{value}</h3>
          <p className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
        </div>
      ))}
    </div>
  </>
);

// ✅ Bus & Vehicle Cards Component
const BusVehicleCards = ({ title, data, onDelete, type, search, setSearch }) => (
  <div className="bg-white p-4 shadow rounded-lg">
    <h1 className="text-2xl font-semibold mb-4">{title}</h1>
    
    {/* Search Bar */}
    <input
      type="text"
      placeholder={`Search ${title}`}
      className="w-full p-2 border rounded mb-4"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
          <img
            src={`http://localhost:3001/uploads/${item.image}`}
            alt={item.name || "Bus Image"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <button
              onClick={() => onDelete(item._id, type)}
              className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
