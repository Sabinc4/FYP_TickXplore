import React, { useState } from 'react';
import Bus_Tickets from '../Pictures/Bus.jpg'; 

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle the clicked box index
  const toggleDescription = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {/* Image section */}
      <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]">
        <img
          src={Bus_Tickets} // Use the imported image path
          alt="Bus Tickets"
          className="w-full h-full object-cover"
        />
      </div>

      {/* FAQ Section */}
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg mx-auto max-w-2xl mb-6">
          TickXplore is your go-to platform for booking vehicle tickets in Nepal. Whether you're looking to travel by bus, 4x4 jeeps, scorpios, or e-vans.
        </p>
        
        {/* FAQ Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-8 lg:px-16">
          {[
            {
              question: "Can we choose buses from anywhere?",
              answer: "Yes, TickXplore allows you to select buses from various routes and locations across Nepal.",
            },
            {
              question: "How do I pay for tickets?",
              answer: "You can pay for your tickets using various payment methods, including credit/debit cards and mobile wallets.",
            },
            {
              question: "Are there discounts available?",
              answer: "Yes, TickXplore offers occasional discounts and special offers for certain routes and vehicles.",
            },
            {
              question: "Can I book multiple tickets at once?",
              answer: "Yes, you can book multiple tickets for your group in one booking process.",
            },
            {
              question: "How do I cancel my booking?",
              answer: "You can easily cancel your booking through the TickXplore platform, subject to cancellation policies.",
            },
          ].map((faq, index) => (
            <div 
              key={index}
              className="p-4 sm:p-6 border border-gray-300 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => toggleDescription(index)}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                {activeIndex === index ? '−' : '+'} {faq.question}
              </h2>
              {activeIndex === index && (
                <p className="text-sm sm:text-base text-gray-700">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;