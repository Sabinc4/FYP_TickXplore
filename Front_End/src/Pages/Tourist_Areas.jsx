import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Chitwan from "../Pictures/Chitwan.jpg";
import Poon from "../Pictures/Poon.jpg";
import Nagarkot from "../Pictures/Nagarkot.jpg";
import Ghandruk from "../Pictures/Ghandruk.jpeg";
import Kalinchok from "../Pictures/Kalinchok.jpeg";
import Langtang from "../Pictures/Langtang.jpeg";
import Mustang from "../Pictures/Mustang.jpg";

const Tourist_Areas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: Chitwan, title: "Explore Chitwan National Park" },
    { src: Poon, title: "Travel Poon Hill" },
    { src: Nagarkot, title: "Visit Beautiful Nagarkot" },
    { src: Ghandruk, title: "Explore Ghandruk" },
    { src: Kalinchok, title: "Explore Kalinchok (Kuri Village)" },
    { src: Langtang, title: "Explore Langtang" },
    { src: Mustang, title: "Expore Mustang"},
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      <div
        style={{
          backgroundImage: `url(${images[currentIndex].src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-full w-full transition-all duration-500 ease-in-out"
      >
        <div className="flex items-center justify-between h-full bg-black bg-opacity-40 px-8">
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            className="text-white text-4xl bg-gray-800 bg-opacity-50 p-4 rounded-full hover:bg-opacity-80 transition-transform transform hover:scale-110"
          >
            <FaChevronLeft />
          </button>

          {/* Centered Text */}
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              {images[currentIndex].title}
            </h1>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="text-white text-4xl bg-gray-800 bg-opacity-50 p-4 rounded-full hover:bg-opacity-80 transition-transform transform hover:scale-110"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tourist_Areas;
