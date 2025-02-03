import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Import the X icon
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, earnings: 0 });

  // Modal state for adding a vehicle
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "Bus",
    pricePerDay: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
    fetchStats();
  }, []);

  const fetchVehicles = () => {
    axios
      .get("http://localhost:3001/vendor/get-vehicles")
      .then((res) => setVehicles(res.data.vehicles))
      .catch(() => setVehicles([]));
  };

  const fetchBookings = () => {
    axios
      .get("http://localhost:3001/vendor/get-bookings")
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setBookings([]));
  };

  const fetchStats = () => {
    axios
      .get("http://localhost:3001/vendor/get-stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats({ vehicles: 0, bookings: 0, earnings: 0 }));
  };

  const toggleVehicleAvailability = async (vehicleId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/vendor/toggle-vehicle/${vehicleId}`
      );
      alert(response.data.message);
      fetchVehicles();
    } catch (error) {
      alert("Error updating vehicle availability");
    }
  };

  const deleteVehicle = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axios.delete(`http://localhost:3001/vendor/delete-vehicle/${vehicleId}`);
        alert("Vehicle deleted successfully");
        fetchVehicles();
      } catch (error) {
        alert("Error deleting vehicle");
      }
    }
  };

  const addVehicle = async (e) => {
    e.preventDefault();

    if (!newVehicle.name || !newVehicle.pricePerDay || !newVehicle.image) {
      alert("Please fill in all required fields, including an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newVehicle.name);
    formData.append("type", newVehicle.type);
    formData.append("pricePerDay", newVehicle.pricePerDay);
    formData.append("image", newVehicle.image);

    try {
      await axios.post("http://localhost:3001/vendor/add-vehicle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vehicle added successfully!");
      setShowModal(false);
      fetchVehicles();
      setNewVehicle({ name: "", type: "Bus", pricePerDay: "", image: null });
      setPreviewImage(null);
    } catch (error) {
      alert("Error adding vehicle");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewVehicle({ ...newVehicle, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 border-r">
        <h2 className="text-xl font-bold mb-4">Vendor Dashboard</h2>
        <ul>
          {["dashboard", "vehicles", "bookings", "earnings"].map((section) => (
            <li
              key={section}
              className={`p-2 cursor-pointer ${activeSection === section ? "bg-gray-300" : ""}`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeSection === "dashboard" && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 shadow rounded-lg text-center">
                <h3 className="text-lg font-bold">{stats.vehicles}</h3>
                <p className="text-gray-600">Total Vehicles</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg text-center">
                <h3 className="text-lg font-bold">{stats.bookings}</h3>
                <p className="text-gray-600">Total Bookings</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg text-center">
                <h3 className="text-lg font-bold">${stats.earnings}</h3>
                <p className="text-gray-600">Total Earnings</p>
              </div>
            </div>
          </>
        )}

        {/* Vehicles Section */}
        {activeSection === "vehicles" && (
          <div className="bg-white p-4 shadow rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">My Vehicles</h1>
            <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
              + Add Vehicle
            </button>
          </div>
        )}
      </main>

      {/* Modal for Adding Vehicle */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Vehicle</h2>
            <form onSubmit={addVehicle}>
              <input type="text" placeholder="Vehicle Name" className="w-full p-2 border rounded-lg mb-3" 
                value={newVehicle.name} onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })} required />
              <select className="w-full p-2 border rounded-lg mb-3" 
                value={newVehicle.type} onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}>
                <option value="Bus">Bus</option>
                <option value="4x4 Car">4x4 Car</option>
                <option value="Jeep">Jeep</option>
                <option value="Scorpio">Scorpio</option>
              </select>
              <input type="number" placeholder="Price Per Day" className="w-full p-2 border rounded-lg mb-3" 
                value={newVehicle.pricePerDay} onChange={(e) => setNewVehicle({ ...newVehicle, pricePerDay: e.target.value })} required />
              <input type="file" accept="image/*" className="w-full p-2 border rounded-lg mb-3" onChange={handleImageUpload} required />
              {previewImage && <img src={previewImage} alt="Preview" className="w-full h-32 object-cover mb-3 rounded-lg" />}
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg">Add Vehicle</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
