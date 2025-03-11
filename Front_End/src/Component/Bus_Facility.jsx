import React from "react";
import { FaSearch, FaCar, FaCreditCard } from "react-icons/fa";

// Reusable Card Component
const Card = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-900 shadow-xl rounded-md p-6 text-center flex flex-col items-center justify-between min-h-[250px] hover:scale-105 transition-transform duration-300">
    <Icon className="text-5xl text-white mb-4" />
    <h2 className="font-bold text-lg text-white mb-4">{title}</h2>
    <p className="text-sm text-white">{description}</p>
  </div>
);

const Bus_Facility = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-10">
    <div className="text-center max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
        Get Your Tickets in 3 Easy Steps
      </h1>
      <p className="mt-4 text-sm sm:text-base text-gray-600">
        Discover why we’re the best choice for your travel needs. With easy
        booking and trusted services, you can make your trips unforgettable!
      </p>
    </div>
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          icon: FaSearch,
          title: "Search Your Vehicle",
          description:
            "Quickly search for buses by selecting origin, destination, and travel date. Whether you're looking for local or long-distance options, our platform lets you find buses that meet your schedule, route, and seating preferences.",
        },
        {
          icon: FaCar,
          title: "Choose Your Seat",
          description:
            "Enjoy a hassle-free journey by choosing the seat that suits you best. With various seating options like regular, luxury, and sleeper buses, you can select the perfect seat based on your comfort needs, journey length, and budget.",
        },
        {
          icon: FaCreditCard,
          title: "Pay and Relax",
          description:
            "Securely pay online for your ticket and confirm your booking instantly. Skip the long lines at bus terminals and enjoy peace of mind with our easy and safe payment process, ensuring your seat is booked in a matter of minutes.",
        },
      ].map((card, index) => (
        <div key={index} className="w-full">
          <Card {...card} />
        </div>
      ))}
    </div>
  </div>
);

export default Bus_Facility;