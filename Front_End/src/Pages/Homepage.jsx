import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaCaretDown, FaSearch } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import Hill from "../Pictures/Bus_Tickets.jpg";

const Bus_Tickets = () => {
  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });

  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropLocations, setDropLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(true);

  // Fetch pickup and drop locations from buses & vehicles (WITHOUT fetching dates)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [busResponse, vehicleResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/buses"),
          axios.get("http://localhost:3001/api/vehicles"),
        ]);

        const busData = Array.isArray(busResponse.data) ? busResponse.data : busResponse.data.buses || [];
        const vehicleData = Array.isArray(vehicleResponse.data) ? vehicleResponse.data : vehicleResponse.data.vehicles || [];

        const busLocations = busData.map((bus) => ({
          pickup: bus.pickupPoint,
          drop: bus.dropPoint,
        }));

        const vehicleLocations = vehicleData.map((vehicle) => ({
          pickup: vehicle.pickupPoint,
          drop: vehicle.dropPoint,
        }));

        // Merge locations and remove duplicates
        const allPickupPoints = [...new Set([...busLocations.map((b) => b.pickup), ...vehicleLocations.map((v) => v.pickup)])];
        const allDropPoints = [...new Set([...busLocations.map((b) => b.drop), ...vehicleLocations.map((v) => v.drop)])];

        setPickupLocations(allPickupPoints);
        setDropLocations(allDropPoints);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setFetchingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert(`Searching from ${formData.pickupPoint} to ${formData.droppingPoint} on ${formData.date}`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <img src={Hill} alt="Background" className="absolute inset-0 w-full h-full object-cover" />

        {/* Dark Overlay for Better Visibility */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Title */}
        <div className="absolute inset-x-0 top-[25%] px-4 text-center">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
            Ride Your Future with <span className="text-blue-400">TickXplore</span>
          </h2>
        </div>

        {/* Search Box */}
        <div className="absolute inset-x-0 top-[35%] px-4 flex justify-center">
          <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded-lg border border-gray-200 ">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                
                {/* Pickup Point */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Point
                  </label>
                  <div className="relative flex items-center">
                    <FaMapMarkerAlt className="absolute left-3 text-gray-400 text-2xl" />
                    <select
                      name="pickupPoint"
                      value={formData.pickupPoint}
                      onChange={handleChange}
                      className="w-full pl-10 pr-8 py-2 border rounded-md appearance-none focus:ring-2 focus:ring-blue-300"
                      required
                      disabled={fetchingLocations}
                    >
                      {fetchingLocations ? (
                        <option>Loading locations...</option>
                      ) : pickupLocations.length === 0 ? (
                        <option>No locations available</option>
                      ) : (
                        <>
                          <option value="" disabled>Select Pickup Point</option>
                          {pickupLocations.map((location, index) => (
                            <option key={index} value={location}>
                              {location}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <FaCaretDown className="absolute right-3 text-gray-400 text-2xl" />
                  </div>
                </div>

                {/* Dropping Point */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dropping Point
                  </label>
                  <div className="relative flex items-center">
                    <FaMapMarkerAlt className="absolute left-3 text-gray-400 text-2xl" />
                    <select
                      name="droppingPoint"
                      value={formData.droppingPoint}
                      onChange={handleChange}
                      className="w-full pl-10 pr-8 py-2 border rounded-md appearance-none focus:ring-2 focus:ring-blue-300"
                      required
                      disabled={fetchingLocations}
                    >
                      {fetchingLocations ? (
                        <option>Loading locations...</option>
                      ) : dropLocations.length === 0 ? (
                        <option>No locations available</option>
                      ) : (
                        <>
                          <option value="" disabled>Select Dropping Point</option>
                          {dropLocations.map((location, index) => (
                            <option key={index} value={location}>
                              {location}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <FaCaretDown className="absolute right-3 text-gray-400 text-2xl" />
                  </div>
                </div>

                {/* Date Selection (No API fetching) */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end sm:col-span-2 md:col-span-1">
                  <button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md"
                  >
                    <FaSearch className="text-lg" /> 
                    <span>Find Tickets</span>
                  </button>
                </div>

                

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bus_Tickets;
