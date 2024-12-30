import React from 'react';
import { FaWifi, FaBed, FaCogs } from 'react-icons/fa';

const Service_Card = () => {
  return (
    <div className="px-6 py-8 bg-gray-50">
      {/* Section Header */}
      <div className="text-center max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Our Premium Services</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore the top features of our buses and make your travel experience unforgettable!
        </p>
      </div>

      {/* Service Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {[ 
          {
            icon: FaWifi,
            title: "Free WiFi",
            description: "Stay connected with high-speed WiFi onboard. Browse, stream, or work without interruptions.",
          },
          {
            icon: FaBed,
            title: "Comfortable Pillows",
            description: "Rest and relax with our plush pillows, designed to give you a peaceful journey.",
          },
          {
            icon: FaCogs,
            title: "Complimentary Water Bottle",
            description: "Stay hydrated throughout your journey with a free water bottle provided on board.",
          },
        ].map((card, index) => (
          <div key={index} className="max-w-sm mx-auto">
            <div className="bg-slate-800 shadow-lg rounded-lg p-8 text-center flex flex-col items-center justify-between min-h-[250px] hover:scale-105 transition-all duration-300">
              <card.icon className="text-6xl text-white mb-4" />
              <h2 className="font-semibold text-xl text-white mb-4">{card.title}</h2>
              <p className="text-white text-sm">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service_Card;
