import React, { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);


 // ✅ Fetch Data from API
 const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const [usersRes, vendorsRes, adminsRes, busesRes, vehiclesRes] =
      await Promise.all([
        axios.get("http://localhost:3001/admin/get-users"),
        axios.get("http://localhost:3001/admin/get-vendors"),
        axios.get("http://localhost:3001/admin/get-admins"),
        axios.get("http://localhost:3001/api/buses"),
        axios.get("http://localhost:3001/api/vehicles"),
      ]);

    setUsers(usersRes.data.users || []);
    setVendors(vendorsRes.data.vendors || []);
    setAdmins(adminsRes.data.admins || []);
    setBuses(busesRes.data.buses || busesRes.data.data || []);
    setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data.data || []);

    setStats({
      users: usersRes.data.users?.length || 0,
      vendors: vendorsRes.data.vendors?.length || 0,
      admins: adminsRes.data.admins?.length || 0,
      buses: busesRes.data.buses?.length || busesRes.data.data?.length || 0,
      vehicles:
        vehiclesRes.data.vehicles?.length || vehiclesRes.data.data?.length || 0,
    });
  } catch (error) {
    toast.error("Failed to load data.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Toggle Vendor Activation
  const toggleVendorStatus = async (vendorId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/admin/toggle-vendor/${vendorId}`
      );
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      toast.error("Failed to update vendor status.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer />

      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-6 border-r">
        <h2 className="text-2xl font-bold mb-8 text-blue-700">Admin Dashboard</h2>
        <ul className="space-y-3">
          {["dashboard", "users", "vendors", "admins", "buses", "vehicles"].map(
            (section) => (
              <li
                key={section}
                className={`p-3 cursor-pointer rounded-md transition-all ${
                  activeSection === section
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            )
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading...</div>
        ) : (
          <>
            {activeSection === "dashboard" && <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>}
            {activeSection === "users" && <DataTable title="Users" data={users} fields={["name", "email"]} />}
            {activeSection === "vendors" && <VendorsTable vendors={vendors} onToggleStatus={toggleVendorStatus} />}
            {activeSection === "admins" && <DataTable title="Admins" data={admins} fields={["name", "email"]} />}
            {activeSection === "buses" && <BusCards buses={buses} />}
            {activeSection === "vehicles" && <VehicleCards vehicles={vehicles} />}
          </>
        )}
      </main>
    </div>
  );
};

// ✅ Data Table Component
const DataTable = ({ title, data, fields }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
    <table className="w-full border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-blue-600 text-white">
          {fields.map((key) => (
            <th key={key} className="border border-gray-300 px-6 py-3">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border border-gray-300 bg-white">
            {fields.map((field, i) => (
              <td key={i} className="border border-gray-300 px-6 py-3">
                {String(item[field])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ✅ Vendors Table with Activation Toggle
const VendorsTable = ({ vendors, onToggleStatus }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vendors</h2>
    <table className="w-full border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="border border-gray-300 px-6 py-3">Vendor Name</th>
          <th className="border border-gray-300 px-6 py-3">Email</th>
          <th className="border border-gray-300 px-6 py-3">Status</th>
          <th className="border border-gray-300 px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {vendors.map((vendor) => (
          <tr key={vendor._id} className="border border-gray-300 bg-white">
            <td className="border border-gray-300 px-6 py-3">{vendor.vendorName}</td>
            <td className="border border-gray-300 px-6 py-3">{vendor.email}</td>
            <td className="border border-gray-300 px-6 py-3">
              {vendor.isActive ? "Active" : "Inactive"}
            </td>
            <td className="border border-gray-300 px-6 py-3">
              <button
                onClick={() => onToggleStatus(vendor._id)}
                className={`px-4 py-2 text-white rounded-md ${
                  vendor.isActive ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {vendor.isActive ? "Deactivate" : "Activate"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ✅ Bus Cards Section
const BusCards = ({ buses }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Buses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {buses.map((bus) => (
        <div key={bus._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
          <img
            src={bus.image.startsWith("http") ? bus.image : `http://localhost:3001${bus.image}`}
            alt={bus.busName || "Bus Image"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{bus.busName}</h3>
            <p className="text-gray-600">Price Per Seat: Rs. {bus.pricePerSeat}</p>
            <p className="text-gray-600">Pickup: {bus.pickupPoint}</p>
            <p className="text-gray-600">Drop: {bus.dropPoint}</p>
            <p className="text-gray-600">Total Seats: {bus.totalSeats}</p>
            <p className="text-gray-600">Booked Seats: {bus.bookedSeats?.length || 0}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
// ✅ Vehicle Cards Section
const VehicleCards = ({ vehicles }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vehicles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
          <img
            src={vehicle.image.startsWith("http") ? vehicle.image : `http://localhost:3001${vehicle.image}`}
            alt={vehicle.name || "Vehicle Image"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
            <p className="text-gray-600">Type: {vehicle.type}</p>
            <p className="text-gray-600">Price: Rs. {vehicle.price}</p>
            <p className="text-gray-600">Availability: {vehicle.isAvailable ? "Available" : "Not Available"}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
