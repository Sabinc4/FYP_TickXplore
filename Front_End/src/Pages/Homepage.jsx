import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCaretDown, FaSearch } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import Hill from "../Pictures/Bus_Tickets.jpg";

const Bus_Tickets = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ Prevent unnecessary re-renders
  const isHomepage = useMemo(() => location.pathname === "/", [location.pathname]);

  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: new Date().toISOString().split("T")[0], 
  });

  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropLocations, setDropLocations] = useState([]);
  const [fetchingLocations, setFetchingLocations] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Locations Only on Homepage Load
  useEffect(() => {
    if (!isHomepage) return;

    const fetchLocations = async () => {
      try {
        const [busResponse, vehicleResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/buses?homepage=true"),
          axios.get("http://localhost:3001/api/vehicles?homepage=true"),
        ]);

        const busLocations = busResponse.data.buses || [];
        const vehicleLocations = vehicleResponse.data.vehicles || [];

        setPickupLocations([...new Set([...busLocations.map(b => b.pickupPoint), ...vehicleLocations.map(v => v.pickupPoint)])].filter(Boolean));
        setDropLocations([...new Set([...busLocations.map(b => b.dropPoint), ...vehicleLocations.map(v => v.dropPoint)])].filter(Boolean));
      } catch (error) {
        console.error("❌ Error fetching locations:", error);
        setError(error.response?.data?.message || "Failed to load locations. Please try again.");
      } finally {
        setFetchingLocations(false);
      }
    };

    fetchLocations();
  }, [isHomepage]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.pickupPoint || !formData.droppingPoint) {
      alert("Please select both Pickup and Dropping Points.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate(`/tickets?pickup=${formData.pickupPoint}&drop=${formData.droppingPoint}&date=${formData.date}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Background Image */}
      <div className="relative w-full h-screen">
        <img src={Hill} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* ✅ Title */}
        <div className="absolute inset-x-0 top-[25%] px-4 text-center">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
            Ride Your Future with <span className="text-blue-400">TickXplore</span>
          </h2>
        </div>

        {/* ✅ Booking Form */}
        <div className="absolute inset-x-0 top-[35%] px-4 flex justify-center">
          <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                
                {/* ✅ Pickup Point Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Point</label>
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
                      <option value="" disabled>Select Pickup Point</option>
                      {fetchingLocations ? (
                        <option>Loading locations...</option>
                      ) : pickupLocations.length === 0 ? (
                        <option>No locations available</option>
                      ) : (
                        pickupLocations.map((location, index) => (
                          <option key={index} value={location}>{location}</option>
                        ))
                      )}
                    </select>
                    <FaCaretDown className="absolute right-3 text-gray-400 text-2xl" />
                  </div>
                </div>

                {/* ✅ Dropping Point Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dropping Point</label>
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
                      <option value="" disabled>Select Dropping Point</option> {/* ✅ Default empty option */}
                      {fetchingLocations ? (
                        <option>Loading locations...</option>
                      ) : dropLocations.length === 0 ? (
                        <option>No locations available</option>
                      ) : (
                        dropLocations.map((location, index) => (
                          <option key={index} value={location}>{location}</option>
                        ))
                      )}
                    </select>
                    <FaCaretDown className="absolute right-3 text-gray-400 text-2xl" />
                  </div>
                </div>

                {/* ✅ Date Picker */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                {/* ✅ Submit Button */}
                <div className="flex justify-end sm:col-span-2 md:col-span-1">
                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md">
                    {loading ? "Searching..." : <><FaSearch className="text-lg" /><span>Find Tickets</span></>}
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
