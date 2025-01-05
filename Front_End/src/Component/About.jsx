import React from "react";
import aboutusimage from "../Pictures/Bus.jpg"; // Adjust the path as needed
import busImage from "../Pictures/bus1.jpg"; // Example image for bus
import vehicleImage from "../Pictures/vehicle.jpg"; // Example image for vehicle rental

const AboutUs = () => (
  <div className="bg-gray-100 m-0 p-0 overflow-x-hidden">
    {/* About Us Header */}
    <section className="relative">
      {/* Background Image */}
      <div
        className="w-full relative flex items-center justify-center text-white overflow-hidden"
        style={{
          height: "20vh", // 20% of viewport height
          backgroundImage: `url(${aboutusimage})`, // Correctly use the imported image
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Text Overlay */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-opacity-50 px-4 py-2 rounded-md">
          About Us
        </h1>
      </div>
    </section>

    {/* Section Content */}
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-6">
      <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
        Welcome to <strong>TickXplore</strong>, your go-to platform for seamless vehicle bookings across Nepal. Whether you're planning a trip to a tourist destination, need to rent a vehicle, or book a bus ticket for your journey, we've got you covered!
      </p>

      <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
        Our mission is to provide a hassle-free booking experience for both locals and tourists. We aim to make it easy for you to explore the beautiful destinations of Nepal by offering quick and easy access to vehicle reservations.
      </p>

      {/* Image and Text Section */}
      <div className="flex flex-wrap items-center justify-between gap-6 my-8 px-4">
        {/* Left Image */}
        <div className="flex-1">
          <img
            src={busImage} // Bus image for the service
            alt="Bus Travel"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Text on Right */}
        <div className="flex-1">
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            Book your bus tickets easily and travel across the most scenic routes in Nepal with TickXplore. We offer a range of comfortable bus services that connect you to various tourist destinations in Nepal.
          </p>
        </div>
      </div>

      {/* Another Image and Text Section */}
      <div className="flex flex-wrap items-center justify-between gap-6 my-8 px-4">
        {/* Right Image */}
        <div className="flex-1 order-2 sm:order-1">
          <img
            src={vehicleImage} // Vehicle rental image
            alt="Vehicle Rental"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Text on Left */}
        <div className="flex-1 order-1 sm:order-2">
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            Rent a variety of vehicles like 4x4s, jeeps, and Scorpios for your trips to the mountains and beyond. Our fleet is designed to make your journey more comfortable and exciting.
          </p>
        </div>
      </div>

      <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mt-6">
        Join **TickXplore** today and start your journey with ease. Whether you're planning a road trip or need transport for a group tour, we ensure a smooth and reliable experience every time.
      </p>
    </div>
  </div>
);

export default AboutUs;
