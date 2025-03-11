import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';

// Images
import Namo_Buddha from "../Pictures/Namo_Buddha.jpg";
import Poon from "../Pictures/Poon.jpg";
import Chitwan from "../Pictures/Chitwan.jpg";
import Ghandruk from "../Pictures/Ghandruk.jpeg";
import Kalinchok from "../Pictures/Kalinchok.jpeg";
import Mustang from "../Pictures/Mustang.jpg";
import Rara from "../Pictures/Rara.jpg";
import Pokhara from "../Pictures/Pokhara.jpeg";
import Langtang from "../Pictures/Langtang.jpeg";
import Nagarkot from "../Pictures/Nagarkot.jpg";

const TouristVisit = () => {
  const cardRef = useRef(null);

  const scrollCards = (direction) => {
    if (cardRef.current) {
      cardRef.current.scrollBy({ left: direction, behavior: 'smooth' });
    }
  };

  const areas = [
    {
      image: Poon,
      title: "Poon Hill",
      description: "A famous viewpoint offering panoramic views of the Annapurna and Dhaulagiri mountain ranges.",
      price: "1000 NPR",
      rating: 4.8,
    },
    {
      image: Ghandruk,
      title: "Ghandruk",
      description: "A picturesque village with traditional Gurung culture, offering amazing views of the Annapurna range.",
      price: "1500 NPR",
      rating: 4.7,
    },
    {
      image: Chitwan,
      title: "Chitwan",
      description: "A UNESCO World Heritage Site, famous for its wildlife safari experiences, including rhinos, tigers, and elephants.",
      price: "1500 NPR",
      rating: 4.7,
    },
    {
      image: Pokhara,
      title: "Pokhara",
      description: "A scenic lakeside city known for adventure sports, trekking, and breathtaking views of the Himalayas.",
      price: "800 NPR",
      rating: 4.9,
    },
    {
      image: Namo_Buddha,
      title: "Namo Buddha",
      description: "A sacred Buddhist site with a beautiful monastery and breathtaking views of the surrounding hills.",
      price: "500 NPR",
      rating: 4.5,
    },
    {
      image: Mustang,
      title: "Mustang",
      description: "A remote region offering a unique Tibetan culture, ancient monasteries, and incredible landscapes.",
      price: "2000 NPR",
      rating: 4.7,
    },
    {
      image: Kalinchok,
      title: "Kalinchok",
      description: "A popular pilgrimage site with stunning views of the Himalayas, often visited for its temple and snow activities.",
      price: "600 NPR",
      rating: 4.4,
    },
    {
      image: Nagarkot,
      title: "Nagarkot",
      description: "Famous for its panoramic sunrise views of the Everest range, offering a peaceful retreat near Kathmandu.",
      price: "500 NPR",
      rating: 4.5,
    },
    {
      image: Langtang,
      title: "Langtang",
      description: "A beautiful trekking destination known for its stunning views of the Langtang mountain range and Tamang culture.",
      price: "1500 NPR",
      rating: 4.6,
    },
    {
      image: Rara,
      title: "Rara",
      description: "Nepal's largest lake, located in a remote and peaceful area, offering scenic views and a serene environment.",
      price: "1800 NPR",
      rating: 4.8,
    }
  ];

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

      {/* Scrollable Tourist Cards */}
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
    </div>
  );
};

export default TouristVisit;