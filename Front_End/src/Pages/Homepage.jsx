import React from "react";
import bus1 from "../Pictures/Bus_Tickets.jpg";
import bus2 from "../Pictures/vehicle.jpg";
import bus3 from "../Pictures/download.jpeg";
import bus4 from "../Pictures/E_vans.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section with Heading and Description */}
      <div className="w-full h-[90vh] min-h-screen flex flex-col items-center justify-center bg-gray-300 relative">
        {/* Card with Heading and Description */}
        <div className="w-full h-[900px] bg-white rounded-lg overflow-hidden relative flex flex-col justify-start items-center">
          {/* Heading and Description */}
          <div className="flex flex-col items-center bg-white px-3 py-6 pt-5"> 
            <h2 className="text-black text-xl sm:text-4xl md:text-4xl font-bold mt-0"> {/* Removed extra margin-top */}
              Explore Nepal with TickXplore
            </h2>
            <p className="text-black text-sm sm:text-lg md:text-xl mt-2 max-w-2xl text-center"> {/* Reduced margin-top to mt-2 */}
              Your one-stop platform for booking tickets and exploring the beauty of Nepal.
            </p>
          </div>

          {/* Cards Section below Heading and Description */}
          <div className="w-full py-10 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
                <img
                  src={bus1} // Corrected the image path
                  alt="bus1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 2 */}
              <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
                <img
                  src={bus2} // Corrected the image path
                  alt="bus2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 3 */}
              <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
                <img
                  src={bus3} // Corrected the image path
                  alt="bus3"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 4 */}
              <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
                <img
                  src={bus4} // Corrected the image path
                  alt="bus4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
