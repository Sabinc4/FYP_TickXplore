import React, { useState, useEffect, useRef } from "react";
import Hill from "../Pictures/Hill.jpg"; // Background Image
import { FaMapMarkerAlt, FaCaretDown, FaSearch, FaCar, FaCreditCard } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaWifi, FaBed, FaCogs, FaGlassCheers } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

  // Tourist Areas Scroll Management
  const scrollRef = useRef(null); // Reference for scrolling
  const scrollAmount = 300; // Scroll distance for each click

  // Handle scrolling to the left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollAmount;
    }
  };

  // Handle scrolling to the right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background Section */}
      <div className="w-full h-[80vh] relative overflow-hidden shadow-lg">
        <img
          src={Hill}
          alt="Homepage Background"
          className="w-full h-full object-cover"
        />
        {/* Navbar */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center">
          <nav className="absolute top-5 left-5 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-white z-10">
            {["Bus Tickets", "Scorpio", "E-Vans", "4x4 Jeeps", "Things to Do"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm sm:text-base lg:text-lg font-semibold hover:text-slate-400 cursor-pointer py-2 px-4"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-x-0 top-[30%] px-4 text-center">
          <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold">
            Ride your Future with TickXplore
          </h2>
        </div>

        {/* Ticket Search Section */}
        <div className="absolute inset-x-0 top-[40%] px-4">
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Pickup Point */}
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

                {/* Dropping Point */}
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

                {/* Date */}
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

                {/* Submit Button */}
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

      {/* Cards Section */}
      <div className="px-3 mt-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Get Your Tickets in 3 Easy Steps
          </h1>
          <p className="mt-4 text-gray-600">
            Discover why we’re the best choice for your travel needs. With easy
            booking and trusted services, you can make your trips unforgettable!
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              icon: FaSearch,
              title: "Search Your Vehicle",
              description: "Quickly search for buses by selecting origin, destination, and travel date. Whether you're looking for local or long-distance options, our platform lets you find buses that meet your schedule, route, and seating preferences.",
            },
            {
              icon: FaCar,
              title: "Choose Your Seat",
              description: "Enjoy a hassle-free journey by choosing the seat that suits you best. With various seating options like regular, luxury, and sleeper buses, you can select the perfect seat based on your comfort needs, journey length, and budget.",
            },
            {
              icon: FaCreditCard,
              title: "Pay and Relax",
              description: "Securely pay online for your ticket and confirm your booking instantly. Skip the long lines at bus terminals and enjoy peace of mind with our easy and safe payment process, ensuring your seat is booked in a matter of minutes.",
            },
          ].map((card, index) => (
            <div key={index} className="max-w-sm mx-auto">
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="px-3 mt-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Our Services</h1>
          <p className="mt-4 text-gray-600">
            Have a look at our popular reasons why you should choose our buses. Just choose a bus and get a ticket for your great journey!
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="max-w-sm mx-auto">
            <Card
              icon={FaWifi}
              title="Free WiFi"
              description="Enjoy high-speed WiFi on board to stay connected throughout your journey."
            />
          </div>
          <div className="max-w-sm mx-auto">
            <Card
              icon={FaBed}
              title="Comfortable Pillow"
              description="Relax with comfortable pillows for a more pleasant and restful ride."
            />
          </div>
          <div className="max-w-sm mx-auto">
            <Card
              icon={FaCogs}
              title="Water Bottle"
              description="Stay refreshed with a complimentary water bottle provided during your journey."
            />
          </div>
        </div>
      </div>
      <div className="relative mt-10">
        <h2 className="text-2xl font-bold text-white">Tourist Areas</h2>
        <div className="flex items-center justify-center mt-4 relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white p-2 bg-gray-700 rounded-full"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 px-4 py-2 w-full"
          >
            {/* Add your tourist area cards here */}
            <Card
              icon={FaMapMarkerAlt}
              title="Tourist Area 1"
              description="Explore the beauty of the first tourist area."
            />
            <Card
              icon={FaCar}
              title="Tourist Area 2"
              description="Discover the wonders of the second tourist area."
            />
            <Card
              icon={FaCreditCard}
              title="Tourist Area 3"
              description="Visit the historical sites of the third tourist area."
            />
            {/* Add more cards as needed */}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white p-2 bg-gray-700 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
