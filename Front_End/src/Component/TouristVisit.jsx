import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const TouristVisit = () => {
  const cardRef = useRef(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristAreas = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/tourist-areas");
        setAreas(response.data);
      } catch (error) {
        console.error("❌ Error fetching tourist areas:", error);
        setError("Failed to load tourist areas. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTouristAreas();
  }, []);

  const scrollCards = (direction) => {
    if (cardRef.current) {
      cardRef.current.scrollBy({ left: direction, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 mt-10">
      {/* Section Title */}
      <div className="text-center max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Explore Popular Tourist Areas
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600">
          Discover Nepal’s stunning tourist destinations and plan your next adventure with us!
        </p>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-500 mt-6">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      {/* Scrollable Tourist Cards */}
      {!loading && !error && (
        <div className="relative mt-6">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCards(-300)}
            className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 sm:p-4 rounded-full z-10 hover:bg-gray-700 transition-colors"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={cardRef}
            className="flex overflow-x-auto overflow-y-hidden gap-4 sm:gap-6 scroll-smooth pb-5 px-2 sm:px-6"
            style={{
              scrollbarWidth: 'none', /* For Firefox */
              msOverflowStyle: 'none', /* For IE and Edge */
            }}
          >
            {areas.map((area, index) => (
              <div
                key={index}
                className="min-w-[250px] sm:min-w-[300px] md:min-w-[350px] bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={area.image}
                  alt={area.title}
                  className="w-full h-32 sm:h-40 object-cover rounded-md mb-3 sm:mb-4"
                />
                <h2 className="font-bold text-base sm:text-lg text-black mb-1 sm:mb-2">{area.title}</h2>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{area.description}</p>
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={`${
                        starIndex < Math.floor(area.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } text-sm sm:text-base`}
                    />
                  ))}
                  {area.rating % 1 !== 0 && (
                    <FaStarHalfAlt className="text-yellow-500 text-sm sm:text-base" />
                  )}
                </div>
                <p className="text-gray-800 font-medium text-sm sm:text-base">Price: {area.price}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollCards(300)}
            className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 sm:p-4 rounded-full z-10 hover:bg-gray-700 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default TouristVisit;
