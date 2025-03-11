import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

  const API_BASE_URL = "http://localhost:3001/api";

  // Vehicle API Functions
  const fetchVehicles = (vendorId) => axios.get(`${API_BASE_URL}/vehicles?vendorId=${vendorId}`);
  const addVehicle = (formData) => axios.post(`${API_BASE_URL}/vehicles`, formData);
  const updateVehicle = (id, formData) => axios.put(`${API_BASE_URL}/vehicles/${id}`, formData);
  const deleteVehicle = (id) => axios.delete(`${API_BASE_URL}/vehicles/${id}`);

  // Bus API Functions
  const fetchBuses = (vendorId) => axios.get(`${API_BASE_URL}/buses?vendorId=${vendorId}`);
  const addBus = (formData) => axios.post(`${API_BASE_URL}/buses`, formData, {
    headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
  });
  const updateBus = (id, formData) => axios.put(`${API_BASE_URL}/buses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
  });
  const deleteBus = (id) => axios.delete(`${API_BASE_URL}/buses/${id}`);

  useEffect(() => {
    fetchData();
  }, [vendorId]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vehiclesRes, busesRes] = await Promise.all([
        fetchVehicles(vendorId),
        fetchBuses(vendorId),
      ]);
      console.log("Vehicles Data:", vehiclesRes.data.vehicles); // Debug log
      console.log("Buses Data:", busesRes.data.buses); // Debug log
      setVehicles(vehiclesRes.data.vehicles || []);
      setBuses(busesRes.data.buses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please check your network and try again.");
      toast.error("Failed to load data. Please check your network and try again.", {
        position: "top-right",
        autoClose: 5000,
      });
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
        await deleteVehicle(vehicleId);
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
        await deleteBus(busId);
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <aside className="w-64 bg-gray-800 text-white p-5 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Vendor Portal
        </h2>
        <ul className="space-y-2">
          {[
            { id: "dashboard" },
            { id: "vehicles" },
            { id: "buses" },
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
                    addBus={addBus} // Pass addBus function
                    updateBus={updateBus} // Pass updateBus function
                    addVehicle={addVehicle} // Pass addVehicle function
                    updateVehicle={updateVehicle} // Pass updateVehicle function
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
  src={item.image ? item.image : "/default-transport.jpg"}
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
        {type === "bus" ? (
          <>
            <InfoItem label="Price per Seat" value={`Rs. ${item.pricePerSeat}`} />
            <InfoItem label="Total Seats" value={item.totalSeats} />
            <InfoItem label="Pickup" value={item.pickupPoint} />
            <InfoItem label="Drop" value={item.dropPoint} />
          </>
        ) : (
          <>
          <InfoItem label="Price" value={`Rs. ${item.price}`} />
          <InfoItem label="Capacity" value={item.capacity} />
          <InfoItem label="Status" value={item.isAvailable ? "Available" : "Reserved"} />
          <InfoItem label="Pickup" value={item.pickupPoint} />
          <InfoItem label="Drop" value={item.dropPoint} />
          </>
        )}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          {item.takeOffDate ? 
            new Date(item.takeOffDate).toLocaleDateString() : 
            'Date not set'
          }
        </span>
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

const FormInput = ({ label, type = "text", name, value, onChange, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

const AddEditForm = ({
  vehicle,
  bus,
  isAdding,
  type,
  onClose,
  onFetchData,
  addBus,
  updateBus,
  addVehicle,
  updateVehicle,
}) => {
  const [formData, setFormData] = useState({
    name: vehicle?.name || bus?.name || "",
    type: type === "vehicles" ? "Vehicle" : "Bus",
    pricePerSeat: bus?.pricePerSeat || "",
    price: vehicle?.price || "",
    capacity: vehicle?.capacity || "",
    image: "",
    pickupPoint: vehicle?.pickupPoint || bus?.pickupPoint || "",
    dropPoint: vehicle?.dropPoint || bus?.dropPoint || "",
    totalSeats: bus?.totalSeats || "",
    isAvailable: vehicle?.isAvailable || true,
    tripDate: vehicle?.tripDate ? new Date(vehicle.tripDate).toISOString().split("T")[0] : "",
    takeOffDate: (vehicle?.takeOffDate || bus?.takeOffDate) ? 
      new Date(vehicle?.takeOffDate || bus?.takeOffDate).toISOString().split("T")[0] : 
      "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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

      if (!formData.takeOffDate) {
        toast.error('Please select a take-off date');
        return;
      }
      
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      let response;
      if (type === "vehicles") {
        response = isAdding
          ? await addVehicle(formDataToSend)
          : await updateVehicle(vehicle._id, formDataToSend);
      } else {
        response = isAdding
          ? await addBus(formDataToSend)
          : await updateBus(bus._id, formDataToSend);
      }

      if (response.data.success) {
        toast.success(`${type === "vehicles" ? "Vehicle" : "Bus"} ${isAdding ? "added" : "updated"} successfully!`);
        onFetchData();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isAdding ? `Add New ${type === "vehicles" ? "Vehicle" : "Bus"}` : `Edit ${type === "vehicles" ? "Vehicle" : "Bus"}`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <FormInput label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

          {type === "vehicles" && (
            <FormInput
              label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          )}

          {type === "buses" && (
            <FormInput
              label="Price per Seat"
              type="number"
              name="pricePerSeat"
              value={formData.pricePerSeat}
              onChange={(e) => setFormData({ ...formData, pricePerSeat: e.target.value })}
            />
          )}

          <FormInput label="Pickup Point" name="pickupPoint" value={formData.pickupPoint} onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })} />
          <FormInput label="Drop Point" name="dropPoint" value={formData.dropPoint} onChange={(e) => setFormData({ ...formData, dropPoint: e.target.value })} />
          {type === "buses" ? (
            <FormInput label="Total Seats" type="number" name="totalSeats" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} />
          ) : (
            <FormInput label="Capacity" type="number" name="capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
          )}
          <FormInput label="Trip Date" type="date" name="tripDate" value={formData.tripDate} onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })} />
          <FormInput label="Take Off Date" type="date" name="takeOffDate" value={formData.takeOffDate} onChange={(e) => setFormData({ ...formData, takeOffDate: e.target.value })} />

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Upload Image</label>
            <input type="file" accept="image/*" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isSubmitting ? "Submitting..." : isAdding ? "Add" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorDashboard;