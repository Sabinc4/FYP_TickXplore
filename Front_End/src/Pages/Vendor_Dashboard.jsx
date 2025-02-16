import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "react-toastify/dist/ReactToastify.css";

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    if (!vendorId) {
      toast.error("Vendor ID is missing. Please log in again.");
      return;
    }
    fetchData();
  }, [vendorId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vehiclesRes, busesRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/vehicles?vendorId=${vendorId}`),
        axios.get(`http://localhost:3001/api/buses?vendorId=${vendorId}`),
      ]);

      setVehicles(vehiclesRes.data.vehicles || []);
      setBuses(busesRes.data.buses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
      toast.error("Unable to fetch data. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditMode(true);
    setSelectedVehicle(null);
    setSelectedBus(null);
  };

  const handleEditVehicle = (vehicle) => {
    setIsAdding(false);
    setEditMode(true);
    setSelectedVehicle(vehicle);
  };

  const handleEditBus = (bus) => {
    setIsAdding(false);
    setEditMode(true);
    setSelectedBus(bus);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axios.delete(`http://localhost:3001/api/vehicles/${vehicleId}`);
        toast.success("Vehicle deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Error deleting vehicle.");
      }
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await axios.delete(`http://localhost:3001/api/buses/${busId}`);
        toast.success("Bus deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Error deleting bus.");
      }
    }
  };

  // Dashboard Data for Summary Cards and Chart
  const dashboardData = [
    { name: "Vehicles", count: vehicles.length, color: "#3B82F6" },
    { name: "Buses", count: buses.length, color: "#10B981" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Vendor Portal
        </h2>
        <ul className="space-y-2">
          {[
            { id: "dashboard", icon: "🏠" },
            { id: "vehicles", icon: "🚗" },
            { id: "buses", icon: "🚌" },
          ].map(({ id, icon }) => (
            <li
              key={id}
              className={`p-3 cursor-pointer rounded-md flex items-center gap-3 transition-colors ${
                activeSection === id ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveSection(id)}
            >
              <span className="text-lg">{icon}</span>
              <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-6 flex justify-between items-center">
                <p>{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Dashboard Section */}
            {activeSection === "dashboard" ? (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardData.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      <h3 className="text-lg font-semibold text-gray-700">
                        {item.name}
                      </h3>
                      <p className="text-3xl font-bold mt-2" style={{ color: item.color }}>
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Entity Distribution</h2>
                  <div className="h-80">
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
                {/* Vehicles Section */}
                {activeSection === "vehicles" && (
                  <TransportSection
                    title="Vehicles"
                    items={vehicles}
                    type="vehicle"
                    onEdit={handleEditVehicle}
                    onDelete={handleDeleteVehicle}
                    onAddNew={handleAddNew}
                  />
                )}

                {/* Buses Section */}
                {activeSection === "buses" && (
                  <TransportSection
                    title="Buses"
                    items={buses}
                    type="bus"
                    onEdit={handleEditBus}
                    onDelete={handleDeleteBus}
                    onAddNew={handleAddNew}
                  />
                )}

                {/* Add/Edit Form */}
                {(editMode || isAdding) && (
                  <AddEditForm
                    vehicle={selectedVehicle}
                    bus={selectedBus}
                    isAdding={isAdding}
                    type={activeSection}
                    onClose={() => {
                      setEditMode(false);
                      setIsAdding(false);
                    }}
                    onFetchData={fetchData}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
    <span className="text-3xl">{icon}</span>
    <div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  </div>
);

const TransportSection = ({ title, items, type, onEdit, onDelete, onAddNew }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button
        onClick={onAddNew}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add New
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <p className="text-gray-500 text-center col-span-3">No {type}s available.</p>
      ) : (
        items.map((item) => (
          <TransportCard
            key={item._id}
            item={item}
            type={type}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  </div>
);

const TransportCard = ({ item, type, onEdit, onDelete }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="relative">
      <img
        src={item.image ? `http://localhost:3001${item.image}` : "/default-transport.jpg"}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 bg-white/90 rounded-full hover:bg-blue-100 transition-colors"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="p-2 bg-white/90 rounded-full hover:bg-red-100 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <InfoItem label="Price" value={`Rs. ${item.pricePerSeat}`} />
        <InfoItem label="Seats" value={item.totalSeats} />
        {type === "bus" && (
          <>
            <InfoItem label="Pickup" value={item.pickupPoint} />
            <InfoItem label="Drop" value={item.dropPoint} />
          </>
        )}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{new Date(item.tripDate).toLocaleDateString()}</span>
        <span>{type.toUpperCase()}</span>
      </div>
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <span className="text-gray-500">{label}: </span>
    <span className="font-medium">{value}</span>
  </div>
);

const AddEditForm = ({ vehicle, bus, isAdding, type, onClose, onFetchData }) => {
  const [formData, setFormData] = useState({
    name: vehicle?.name || bus?.name || "",
    type: vehicle?.type || bus?.type || (type === "Bus" ? "Bus" : "Vehicle"),
    pricePerSeat: vehicle?.pricePerSeat || bus?.pricePerSeat || "",
    pickupPoint: vehicle?.pickupPoint || bus?.pickupPoint || "",
    dropPoint: vehicle?.dropPoint || bus?.dropPoint || "",
    totalSeats: vehicle?.totalSeats || bus?.totalSeats || "",
    tripDate: vehicle?.tripDate ? new Date(vehicle.tripDate).toISOString().split("T")[0] : "",
    takeOffDate: vehicle?.takeOffDate ? new Date(vehicle.takeOffDate).toISOString().split("T")[0] : "",
    image: "",
  });

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        toast.error("Vendor ID is missing. Please log in again.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("vendorId", vendorId);
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value) formDataToSend.append(key, value);
      });

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const url = isAdding
        ? `http://localhost:3001/api/vehicles`
        : `http://localhost:3001/api/vehicles/${vehicle._id}`;

      const method = isAdding ? "post" : "put";

      const response = await axios[method](url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(`Vehicle ${isAdding ? "added" : "updated"} successfully!`);
        onFetchData();
        onClose();
      }
    } catch (error) {
      console.error("Error posting vehicle:", error);
      toast.error("Failed to add vehicle. Check the console.");
    }
  };

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        toast.error("Vendor ID is missing. Please log in again.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("vendorId", vendorId);
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value) formDataToSend.append(key, value);
      });

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const url = isAdding
        ? `http://localhost:3001/api/buses`
        : `http://localhost:3001/api/buses/${bus._id}`;

      const method = isAdding ? "post" : "put";

      const response = await axios[method](url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(`Bus ${isAdding ? "added" : "updated"} successfully!`);
        onFetchData();
        onClose();
      }
    } catch (error) {
      console.error("Error posting bus:", error);
      toast.error("Failed to add bus. Check the console.");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: type === "buses" ? "Bus" : "Vehicle",
      pricePerSeat: "",
      pickupPoint: "",
      dropPoint: "",
      totalSeats: "",
      tripDate: "",
      takeOffDate: "",
      image: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isAdding ? `Add New ${type === "buses" ? "Bus" : "Vehicle"}` : `Edit ${type === "buses" ? "Bus" : "Vehicle"}`}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Handle submission based on type */}
        <form onSubmit={type === "buses" ? handleBusSubmit : handleVehicleSubmit} className="grid grid-cols-2 gap-4">
          <FormInput label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <FormInput label="Price per Seat" type="number" name="pricePerSeat" value={formData.pricePerSeat} onChange={(e) => setFormData({ ...formData, pricePerSeat: e.target.value })} />
          <FormInput label="Pickup Point" name="pickupPoint" value={formData.pickupPoint} onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })} />
          <FormInput label="Drop Point" name="dropPoint" value={formData.dropPoint} onChange={(e) => setFormData({ ...formData, dropPoint: e.target.value })} />
          <FormInput label="Total Seats" type="number" name="totalSeats" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} />
          <FormInput label="Trip Date" type="date" name="tripDate" value={formData.tripDate} onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })} />
          <FormInput label="Take Off Date" type="date" name="takeOffDate" value={formData.takeOffDate} onChange={(e) => setFormData({ ...formData, takeOffDate: e.target.value })} />
          
          {/* Image Upload */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Upload Image</label>
            <input type="file" accept="image/*" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => { if (e.target.files.length > 0) { setFormData({ ...formData, image: e.target.files[0] }); } }}
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isAdding ? "Add" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const FormInput = ({ label, type = "text", name, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
  </div>
);

export default VendorDashboard;