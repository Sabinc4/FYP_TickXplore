import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMapMarkerAlt, FaSpinner, FaChair, FaInfoCircle } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoMdArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const BusTickets = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // State variables
  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: "",
  });

  const [fetching, setFetching] = useState(false);
  const [buses, setBuses] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropLocations, setDropLocations] = useState([]);
  const [formErrors, setFormErrors] = useState({
    pickupPoint: false,
    droppingPoint: false,
    date: false,
  });

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch data from backend
  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
      throw error;
    }
  };

  // Fetch pickup and drop locations
  const fetchLocations = async () => {
    try {
      const busesData = await fetchData("http://localhost:3001/api/buses");
      const buses = busesData.buses || [];

      const allPickupPoints = [...new Set(buses.map((b) => b.pickupPoint))].filter(Boolean);
      const allDropPoints = [...new Set(buses.map((b) => b.dropPoint))].filter(Boolean);

      setPickupLocations(allPickupPoints);
      setDropLocations(allDropPoints);
    } catch (error) {
      toast.error("Failed to load locations. Please refresh the page.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: false });
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {
      pickupPoint: !formData.pickupPoint,
      droppingPoint: !formData.droppingPoint,
      date: !formData.date,
    };
    setFormErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  };

  // Format date display
  const formatDate = (dateString) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle search for buses
  const handleSearch = async () => {
    if (!validateForm()) return;

    setFetching(true);
    try {
      const busesData = await fetchData("http://localhost:3001/api/buses");
      const allBuses = busesData.buses || [];

      const filteredBuses = allBuses.filter((bus) => {
        const busDate = new Date(bus.takeOffDate).toISOString().split('T')[0];
        return (
          bus.pickupPoint === formData.pickupPoint &&
          bus.dropPoint === formData.droppingPoint &&
          busDate === formData.date &&
          (bus.totalSeats - bus.bookedSeats.length) > 0
        );
      });

      const busesWithDetails = filteredBuses.map((bus) => ({
        ...bus,
        imageUrl: bus.image
          ? new URL(bus.image, "http://localhost:3001").href
          : "/default-bus-image.jpg",
        availableSeats: bus.totalSeats - bus.bookedSeats.length,
      }));

      setBuses(busesWithDetails);
      if (filteredBuses.length === 0) {
        toast.info("No available buses found for selected criteria");
      }
    } catch (err) {
      toast.error("Search failed. Please check your connection.");
    } finally {
      setFetching(false);
    }
  };

  // Handle navigation to seat selection page
  const handleViewSeats = (busId) => {
    navigate(`/Seat_Selection`); // Navigate to the seat selection page with bus ID
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 bg-white shadow-lg rounded-md">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
         Search Bus Tickets
      </h2>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Pickup Point */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div className="flex items-center relative">
            <FaMapMarkerAlt className="absolute left-3 text-gray-400" />
            <select
              name="pickupPoint"
              value={formData.pickupPoint}
              onChange={handleChange}
              className={`w-full pl-10 py-2 border rounded-lg focus:outline-none ${
                formErrors.pickupPoint ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select pickup point</option>
              {pickupLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          {formErrors.pickupPoint && (
            <p className="text-red-500 text-sm mt-1">Pickup point is required</p>
          )}
        </div>

        {/* Dropping Point */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="flex items-center relative">
            <FaMapMarkerAlt className="absolute left-3 text-gray-400" />
            <select
              name="droppingPoint"
              value={formData.droppingPoint}
              onChange={handleChange}
              className={`w-full pl-10 py-2 border rounded-lg focus:outline-none ${
                formErrors.droppingPoint ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select destination</option>
              {dropLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          {formErrors.droppingPoint && (
            <p className="text-red-500 text-sm mt-1">Dropping point is required</p>
          )}
        </div>

        {/* Date */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
          <div className="flex items-center relative">
            <AiOutlineCalendar className="absolute left-3 text-gray-400" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full pl-10 py-2 border rounded-lg focus:outline-none ${
                formErrors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {formErrors.date && (
            <p className="text-red-500 text-sm mt-1">Travel date is required</p>
          )}
        </div>

        {/* Search Button */}
        <div className="md:col-span-1">
          <button
            onClick={handleSearch}
            disabled={fetching}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {fetching ? <FaSpinner className="animate-spin" /> : "Search Buses"}
          </button>
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setFormData({ pickupPoint: "", droppingPoint: "", date: "" });
          setBuses([]);
        }}
        className="w-full md:w-auto px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors mt-4"
      >
        Clear Filters
      </button>

      {/* Results Section */}
      <div className="mt-8 space-y-6">
        {fetching ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : buses.length > 0 ? (
          buses.map((bus) => (
            <div
              key={bus._id}
              className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Bus Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    {bus.name} - {bus.type}
                  </h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Vendor ID: {bus.vendorId.slice(-6)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4 text-gray-600">
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {bus.pickupPoint}
                  </span>
                  <IoMdArrowForward className="text-gray-400" />
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {bus.dropPoint}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="flex items-center text-sm text-gray-600">
                      <AiOutlineCalendar className="mr-2" />
                      {formatDate(bus.takeOffDate)}
                    </p>
                    <p className="flex items-center mt-2 text-sm text-gray-600">
                      <FaChair className="mr-2" />
                      Available: {bus.availableSeats}/{bus.totalSeats}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      NPR {bus.pricePerSeat.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">per seat</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewSeats(bus._id)} // Navigate to seat selection page
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  View Seats & Book
                </button>
              </div>

              {/* Bus Image */}
              <img
                src={bus.imageUrl}
                alt={bus.name}
                className="w-48 h-32 object-cover rounded-lg mt-6 md:mt-0 md:ml-6"
                onError={(e) => (e.target.src = "/default-bus-image.jpg")}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No available buses found. Try different search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default BusTickets;