import React, { useState, useEffect } from "react";
import Hill from "../Pictures/Hill.jpg";
import { AiOutlineCalendar } from "react-icons/ai";
import {  FaMapMarkerAlt, FaCaretDown, FaSearch } from 'react-icons/fa';

// Reusable Card Component
const Card = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-900 shadow-xl rounded-md p-8 text-center flex flex-col items-center justify-between min-h-[250px] hover:scale-105 transition-transform duration-300">
    <Icon className="text-5xl text-white mb-4" />
    <h2 className="font-bold text-lg text-white mb-4">{title}</h2>
    <p className="text-sm text-white">{description}</p>
  </div>
);

const HomePage = () => {
  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: "",
  });

  // Set today's date as the default when the component mounts
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
    <div className="min-h-screen">
      <div className="w-full h-[80vh] relative overflow-hidden shadow-lg">
        <img
          src={Hill}
          alt="Homepage Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-[30%] px-4 text-center">
          <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold">
            Ride your Future with TickXplore
          </h2>
        </div>
        <div className="absolute inset-x-0 top-[40%] px-4">
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="relative">
                  <label
                    htmlFor="pickupPoint"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Pickup Point
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="text"
                      id="pickupPoint"
                      name="pickupPoint"
                      value={formData.pickupPoint}
                      onChange={handleChange}
                      placeholder="Pickup point"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      required
                    />
                    <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="droppingPoint"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Dropping Point
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="text"
                      id="droppingPoint"
                      name="droppingPoint"
                      value={formData.droppingPoint}
                      onChange={handleChange}
                      placeholder="Dropping point"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      required
                    />
                    <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end sm:col-span-2 md:col-span-1">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaSearch className="text-2xl" /> Find Tickets
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

export default HomePage;
