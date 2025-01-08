import React, { useState } from 'react';
import Bus_Tickets from '../Pictures/Bus.jpg'; // Correct import for the image

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle the clicked box index
  const toggleDescription = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {/* Image section */}
      <div className="w-full h-[20vh]">
        <img
          src={Bus_Tickets} // Use the imported image path
          alt="Bus Tickets"
          className="w-[1920px] h-[20vh] object-cover mx-auto"
        />
      </div>

      {/* FAQ Section */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        
        <p className="text-lg mx-auto max-w-2xl mb-6">
          TickXplore is your go-to platform for booking vehicle tickets in Nepal. Whether you're looking to travel by bus, 4x4 jeeps, scorpios, or e-vans.
        </p>
        
        {/* FAQ Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-16">
          <div 
            className="p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
            onClick={() => toggleDescription(0)}
          >
            <h2 className="text-2xl font-semibold mb-2">
              {activeIndex === 0 ? '−' : '+'} Can we choose buses from anywhere?
            </h2>
            {activeIndex === 0 && (
              <p className="text-base">
                Yes, TickXplore allows you to select buses from various routes and locations across Nepal.
              </p>
            )}
          </div>

          <div 
            className="p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
            onClick={() => toggleDescription(1)}
          >
            <h2 className="text-2xl font-semibold mb-2">
              {activeIndex === 1 ? '−' : '+'} How do I pay for tickets?
            </h2>
            {activeIndex === 1 && (
              <p className="text-base">
                You can pay for your tickets using various payment methods, including credit/debit cards and mobile wallets.
              </p>
            )}
          </div>

          <div 
            className="p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
            onClick={() => toggleDescription(2)}
          >
            <h2 className="text-2xl font-semibold mb-2">
              {activeIndex === 2 ? '−' : '+'} Are there discounts available?
            </h2>
            {activeIndex === 2 && (
              <p className="text-base">
                Yes, TickXplore offers occasional discounts and special offers for certain routes and vehicles.
              </p>
            )}
          </div>

          <div 
            className="p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
            onClick={() => toggleDescription(3)}
          >
            <h2 className="text-2xl font-semibold mb-2">
              {activeIndex === 3 ? '−' : '+'} Can I book multiple tickets at once?
            </h2>
            {activeIndex === 3 && (
              <p className="text-base">
                Yes, you can book multiple tickets for your group in one booking process.
              </p>
            )}
          </div>

          <div 
            className="p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
            onClick={() => toggleDescription(4)}
          >
            <h2 className="text-2xl font-semibold mb-2">
              {activeIndex === 4 ? '−' : '+'} How do I cancel my booking?
            </h2>
            {activeIndex === 4 && (
              <p className="text-base">
                You can easily cancel your booking through the TickXplore platform, subject to cancellation policies.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
