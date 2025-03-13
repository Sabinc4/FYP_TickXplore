import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch, FaSpinner } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";

const Bus_Tickets = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomepage = useMemo(() => location.pathname === "/", [location.pathname]);

  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: new Date().toISOString().split("T")[0], 
  });

  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropLocations, setDropLocations] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [title, setTitle] = useState("");
  const [fetchingLocations, setFetchingLocations] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const contentResponse = await axios.get("http://localhost:3001/api/homepage");
        setBackgroundImage(`http://localhost:3001${contentResponse.data.backgroundImage}`);
        setTitle(contentResponse.data.title || "");
      } catch (error) {
        console.error("Error fetching homepage content:", error);
        setError("Failed to load homepage content. Please try again.");
      }
    };
  
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
        console.error("Error fetching locations:", error);
        setError("Failed to load locations. Please try again.");
      } finally {
        setFetchingLocations(false);
      }
    };

    fetchHomepageData();
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.pickupPoint || !formData.droppingPoint) {
      alert("Please select both Pickup and Dropping Points.");
      return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Please select a date that is not in the past.");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      navigate(
        `/tickets?pickup=${encodeURIComponent(formData.pickupPoint)}&drop=${encodeURIComponent(formData.droppingPoint)}&date=${encodeURIComponent(formData.date)}`
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="relative w-full h-screen">
        {backgroundImage && <img src={backgroundImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-x-0 top-[20%] px-4 text-center">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">{title}</h2>
        </div>

        <div className="absolute inset-x-0 top-[35%] px-4 flex justify-center">
          <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pickup Point</label>
                <div className="relative flex items-center">
                  <FaMapMarkerAlt className="absolute left-3 text-gray-400 text-lg" />
                  <select
                    name="pickupPoint"
                    value={formData.pickupPoint}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    required
                    disabled={fetchingLocations}
                  >
                    <option value="" disabled>Select Pickup Point</option>
                    {fetchingLocations ? <option>Loading...</option> : pickupLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="relative flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dropping Point</label>
                <div className="relative flex items-center">
                  <FaMapMarkerAlt className="absolute left-3 text-gray-400 text-lg" />
                  <select
                    name="droppingPoint"
                    value={formData.droppingPoint}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    required
                    disabled={fetchingLocations}
                  >
                    <option value="" disabled>Select Dropping Point</option>
                    {fetchingLocations ? <option>Loading...</option> : dropLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="relative flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <div className="relative flex items-center">
                  <AiOutlineCalendar className="absolute left-3 text-gray-400 text-lg" />
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
              
              <button
                type="submit"
                className="px-5 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 mt-6 sm:mt-0"
                disabled={loading}
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaSearch className="text-lg" /> Find Tickets
                  </>
                )}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bus_Tickets;