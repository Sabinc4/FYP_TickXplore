import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaCaretDown, FaSpinner } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";

const BusTickets = () => {
  // State variables
  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: "",
  });

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
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

  // Fetch data from the backend
  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  // Fetch pickup and drop locations
  const fetchLocations = async () => {
    setError(null);
    try {
      const [busesData, vehiclesData] = await Promise.all([
        fetchData("http://localhost:3001/api/buses"),
        fetchData("http://localhost:3001/api/vehicles"),
      ]);

      const buses = busesData.buses || [];
      const vehicles = vehiclesData.vehicles || [];

      // Extract unique pickup and drop points
      const allPickupPoints = [
        ...new Set([
          ...buses.map((b) => b.pickupPoint),
          ...vehicles.map((v) => v.pickupPoint),
        ]),
      ].filter(Boolean);

      const allDropPoints = [
        ...new Set([
          ...buses.map((b) => b.dropPoint),
          ...vehicles.map((v) => v.dropPoint),
        ]),
      ].filter(Boolean);

      setPickupLocations(allPickupPoints);
      setDropLocations(allDropPoints);
    } catch (error) {
      setError("Failed to load locations. Please try again later.");
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
    return !Object.values(errors).some(Boolean);
  };

  // Handle search for vehicles
  const handleSearch = async () => {
    if (!validateForm()) return;

    setFetching(true);
    setError(null);

    try {
      const [busesData, vehiclesData] = await Promise.all([
        fetchData("http://localhost:3001/api/buses"),
        fetchData("http://localhost:3001/api/vehicles"),
      ]);

      const allVehicles = [
        ...(busesData.buses || []),
        ...(vehiclesData.vehicles || []),
      ];

      // Filter vehicles based on user input
      const filteredVehicles = allVehicles.filter(
        (vehicle) =>
          vehicle.pickupPoint === formData.pickupPoint &&
          vehicle.dropPoint === formData.droppingPoint &&
          new Date(vehicle.takeOffDate).toISOString().split("T")[0] ===
            formData.date
      );

      // Add full image URL to each vehicle
      const vehiclesWithImages = filteredVehicles.map((vehicle) => ({
        ...vehicle,
        imageUrl: vehicle.image
          ? `http://localhost:3001${vehicle.image}`
          : null,
      }));

      setVehicles(vehiclesWithImages);
    } catch (err) {
      setError("Failed to search. Please check your connection and try again.");
    } finally {
      setFetching(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 sm:p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
        Book Your Bus Ticket
      </h2>

      {/* Pickup Point Input */}
      <div className="relative mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pickup Point
          {pickupLocations.length === 0 && (
            <span className="ml-2 text-blue-500">
              <FaSpinner className="inline animate-spin" />
            </span>
          )}
        </label>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <select
            name="pickupPoint"
            value={formData.pickupPoint}
            onChange={handleChange}
            className={`w-full pl-10 pr-8 py-2 border rounded-md appearance-none focus:ring-2 ${
              formErrors.pickupPoint ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="" disabled>
              Select Pickup Point
            </option>
            {pickupLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {formErrors.pickupPoint && (
          <p className="text-red-500 text-sm mt-1">Please select a pickup point</p>
        )}
      </div>

      {/* Dropping Point Input */}
      <div className="relative mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dropping Point
          {dropLocations.length === 0 && (
            <span className="ml-2 text-blue-500">
              <FaSpinner className="inline animate-spin" />
            </span>
          )}
        </label>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <select
            name="droppingPoint"
            value={formData.droppingPoint}
            onChange={handleChange}
            className={`w-full pl-10 pr-8 py-2 border rounded-md appearance-none focus:ring-2 ${
              formErrors.droppingPoint ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="" disabled>
              Select Dropping Point
            </option>
            {dropLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {formErrors.droppingPoint && (
          <p className="text-red-500 text-sm mt-1">Please select a dropping point</p>
        )}
      </div>

      {/* Date Input */}
      <div className="relative mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Travel Date
        </label>
        <div className="relative">
          <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 ${
              formErrors.date ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
        </div>
        {formErrors.date && (
          <p className="text-red-500 text-sm mt-1">Please select a travel date</p>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center"
        disabled={fetching}
      >
        {fetching ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Searching...
          </>
        ) : (
          "Search Buses"
        )}
      </button>

      {/* Results Section */}
      <div className="mt-6">
        {vehicles.length > 0 ? (
          <ul className="space-y-4">
            {vehicles.map((vehicle) => (
              <li
                key={vehicle.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden">
                    {vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-bus-image.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">
                      {vehicle.name} ({vehicle.type})
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">Route:</span>{" "}
                        {vehicle.pickupPoint} → {vehicle.dropPoint}
                      </p>
                      <p>
                        <span className="font-semibold">Departure:</span>{" "}
                        {formatDate(vehicle.takeOffDate)}
                      </p>
                      <p className="text-green-600 font-semibold">
                        Price: {formatPrice(vehicle.pricePerSeat)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !fetching && (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No buses found. Try adjusting your search filters.
              </p>
            </div>
          )
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchLocations}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BusTickets;