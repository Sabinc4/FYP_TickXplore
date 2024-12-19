import React, { useState, useEffect } from "react";
import Hill from "../Pictures/Hill.jpg"; // Image import
import { FaMapMarkerAlt } from "react-icons/fa"; // Icon for Pickup and Dropping Point
import { AiOutlineCalendar } from "react-icons/ai"; // Icon for Date
import { FaSearch, FaCaretDown } from "react-icons/fa"; // Icons for Find Tickets and Dropdown

const HomePage = () => {
  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: "",
  });

  // Set today's date as default value when the component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format as yyyy-mm-dd
    setFormData((prevData) => ({ ...prevData, date: formattedDate }));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching tickets with data:", formData);
    alert(
      `Searching tickets from ${formData.pickupPoint} to ${formData.droppingPoint} on ${formData.date}`
    );
  };

  return (
    <div className="w-full h-[60vh] mx-auto mt-0 p-0 relative overflow-hidden shadow-lg">
      {/* Background Image */}
      <img
        src={Hill}
        alt="Homepage Background"
        className="w-full h-full object-cover"
      />

      {/* Navbar */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center">
        <div className="absolute top-5 left-5 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-white z-10">
          <a
            href="#bus-tickets"
            className="text-sm sm:text-base lg:text-lg font-semibold hover:text-slate-400 cursor-pointer py-2 px-4"
          >
            Bus Tickets
          </a>
          <a
            href="#scorpio"
            className="text-sm sm:text-base lg:text-lg font-semibold hover:text-slate-400 cursor-pointer py-2 px-4"
          >
            Scorpio
          </a>
          <a
            href="#e-vans"
            className="text-sm sm:text-base lg:text-lg font-semibold hover:text-slate-400 cursor-pointer py-2 px-4"
          >
            E-Vans
          </a>
          <a
            href="#4x4-jeeps"
            className="text-sm sm:text-base lg:text-lg font-semibold hover:text-slate-400 cursor-pointer py-2 px-4"
          >
            4x4 Jeeps
          </a>
          <a
            href="#things-to-do"
            className="text-sm sm:text-base lg:text-lg font-semibold hover:text-slate-400 cursor-pointer py-2 px-4"
          >
            Things to Do
          </a>
        </div>
      </div>
      {/* Optional Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center top-[10%] sm:top-[-180px]">
        <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold text-center px-4">
          Ride your Future with TickXplore
        </h2>
      </div>

      {/* Ticket Search Section */}
      <div className="absolute bottom-[140px] left-1/2 transform -translate-x-1/2 w-full px-4">
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Pickup Point */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="pickupPoint"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Pickup Point
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="pickupPoint"
                    name="pickupPoint"
                    value={formData.pickupPoint}
                    onChange={handleChange}
                    placeholder="Pickup point"
                    className="w-full sm:w-[90%] md:w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                  <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Dropping Point */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="droppingPoint"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Dropping Point
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="droppingPoint"
                    name="droppingPoint"
                    value={formData.droppingPoint}
                    onChange={handleChange}
                    placeholder="Dropping point"
                    className="w-full sm:w-[90%] md:w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                  <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Date
                </label>
                <div className="relative">
                  <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full sm:w-[90%] md:w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col justify-end sm:col-span-2 md:col-span-1">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaSearch /> Find Tickets
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
