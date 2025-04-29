import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMapMarkerAlt, FaSpinner, FaChair, FaInfoCircle } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoMdArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";

const BusTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState({
    pickupPoint: queryParams.get("pickup") || "",
    droppingPoint: queryParams.get("drop") || "",
    date: queryParams.get("date") || "",
  });

  const [fetching, setFetching] = useState(false);
  const [buses, setBuses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropLocations, setDropLocations] = useState([]);
  const [formErrors, setFormErrors] = useState({ date: false });

  useEffect(() => {
    fetchLocations();
    if (formData.pickupPoint && formData.droppingPoint && formData.date) {
      handleSearch();
    }
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
      throw error;
    }
  };

  const fetchLocations = async () => {
    try {
      const [busesData, vehiclesData] = await Promise.all([
        fetchData("http://localhost:3001/api/buses"),
        fetchData("http://localhost:3001/api/vehicles"),
      ]);

      const buses = busesData.buses || [];
      const vehicles = vehiclesData.vehicles || [];

      const allPickupPoints = [...new Set([
        ...buses.map((b) => b.pickupPoint),
        ...vehicles.map((v) => v.pickupPoint),
      ])].filter(Boolean);

      const allDropPoints = [...new Set([
        ...buses.map((b) => b.dropPoint),
        ...vehicles.map((v) => v.dropPoint),
      ])].filter(Boolean);

      setPickupLocations(allPickupPoints);
      setDropLocations(allDropPoints);
    } catch (error) {
      toast.error("Failed to load locations.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "date") {
      setFormErrors({ ...formErrors, date: false });
    }
  };

  const validateForm = () => {
    const errors = { date: !formData.date };
    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      toast.error("Please select a travel date.");
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;
    setFetching(true);
    try {
      const [busesData, vehiclesData] = await Promise.all([
        fetchData("http://localhost:3001/api/buses"),
        fetchData("http://localhost:3001/api/vehicles"),
      ]);

      const allBuses = busesData.buses || [];
      const allVehicles = vehiclesData.vehicles || [];

      const filteredBuses = allBuses.filter((bus) => {
        const busDate = bus.takeOffDate ? new Date(bus.takeOffDate).toISOString().split('T')[0] : null;
        const matchesLocation =
          (!formData.pickupPoint || bus.pickupPoint?.toLowerCase() === formData.pickupPoint.toLowerCase()) &&
          (!formData.droppingPoint || bus.dropPoint?.toLowerCase() === formData.droppingPoint.toLowerCase());

        const matchesDate = busDate === formData.date;
        const hasAvailableSeats = (bus.totalSeats - (bus.bookedSeats?.length || 0)) > 0;
        const hasValidPrice = bus.pricePerSeat > 0;

        return matchesLocation && matchesDate && hasAvailableSeats && hasValidPrice;
      });

      const filteredVehicles = allVehicles.filter((vehicle) => {
        const isAvailable = vehicle.isAvailable !== false;
        const hasValidPrice = vehicle.price > 0;

        const hasLocationData = vehicle.pickupPoint && vehicle.dropPoint;

        if (hasLocationData) {
          const matchesLocation =
            (!formData.pickupPoint || vehicle.pickupPoint.toLowerCase() === formData.pickupPoint.toLowerCase()) &&
            (!formData.droppingPoint || vehicle.dropPoint.toLowerCase() === formData.droppingPoint.toLowerCase());

          return matchesLocation && isAvailable && hasValidPrice;
        } else {
          return isAvailable && hasValidPrice;
        }
      });

      const busesWithDetails = filteredBuses.map((bus) => ({
        ...bus,
        imageUrl: bus.image ? new URL(bus.image, "http://localhost:3001").href : "/default-bus-image.jpg",
        availableSeats: bus.totalSeats - (bus.bookedSeats?.length || 0),
        price: bus.pricePerSeat || "N/A",
      }));

      const vehiclesWithDetails = filteredVehicles.map((vehicle) => ({
        ...vehicle,
        imageUrl: vehicle.image ? new URL(vehicle.image, "http://localhost:3001").href : "/default-vehicle-image.jpg",
        price: vehicle.price || "N/A",
      }));

      setBuses(busesWithDetails);
      setVehicles(vehiclesWithDetails);

      if (filteredBuses.length === 0 && filteredVehicles.length === 0) {
        toast.info("No available buses or vehicles found for selected criteria");
      }
    } catch (err) {
      toast.error("Search failed.");
    } finally {
      setFetching(false);
    }
  };

  const handleViewSeats = (id, type) => {
    if (type === "bus") {
      navigate(`/Seat_Selection/${id}`);
    } else {
      navigate(`/Vehicle/${id}`);
    }
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
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="">Select pickup point</option>
              {pickupLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
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
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="">Select destination</option>
              {dropLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
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
            {fetching ? <FaSpinner className="animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

     {/* Clear Filters Button */}
     <button
        onClick={() => {
          setFormData({ pickupPoint: "", droppingPoint: "", date: "" });
          setBuses([]);
          setVehicles([]);
        }}
        className="w-full md:w-auto px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors mt-4"
      >
        Clear Filters
      </button> 

      {/* Results Section */}
      <div className="mt-8 space-y-6">
        {fetching ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mr-4" />
            <span className="text-lg text-gray-600">Searching for available transport...</span>
          </div>
        ) : (
          <>
            {/* Buses */}
            {buses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                  Available Buses ({buses.length})
                </h3>
                {buses.map((bus) => (
                  <TransportCard
                    key={bus._id}
                    data={bus}
                    onSelect={() => handleViewSeats(bus._id, "bus")}
                    type="bus"
                  />
                ))}
              </div>
            )}

            {/* Vehicles */}
            {vehicles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                  Available Vehicles ({vehicles.length})
                </h3>
                {vehicles.map((vehicle) => (
                  <TransportCard
                    key={vehicle._id}
                    data={vehicle}
                    onSelect={() => handleViewSeats(vehicle._id, "vehicle")}
                    type="vehicle"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


// TransportCard Component
const TransportCard = ({ data, onSelect, type }) => {
  if (!data || !data.name) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800">
          {data.name}
        </h3>

        <div className="mt-4 flex items-center gap-4 text-gray-600">
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            {data.pickupPoint || "N/A"}
          </span>
          <IoMdArrowForward className="text-gray-400" />
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            {data.dropPoint || "N/A"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="flex items-center text-sm text-gray-600">
              <AiOutlineCalendar className="mr-2" />
              {type === "bus" ? (
                data.takeOffDate
                  ? new Date(data.takeOffDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date not set"
              ) : (
                "Flexible Reservation Date"
              )}
            </p>

            {type === "bus" && (
              <p className="flex items-center mt-2 text-sm text-gray-600">
                <FaChair className="mr-2" />
                Available: {data.availableSeats || 0}/{data.totalSeats || 0}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              NPR {data.price?.toLocaleString() || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              per {type === "bus" ? "seat" : "vehicle"}
            </p>
          </div>
        </div>

        <button
          onClick={onSelect}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {type === "bus" ? "View Seats & Book" : "Book Vehicle"}
        </button>
      </div>

      <img
        src={data.imageUrl || "/default-vehicle-image.jpg"}
        alt={data.name}
        className="w-48 h-32 object-cover rounded-lg mt-6 md:mt-0 md:ml-6"
      />
    </div>
  );
};

export default BusTickets;
