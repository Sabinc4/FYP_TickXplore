import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";
import Chitwan from "../Pictures/Chitwan.jpg";
import Poon from "../Pictures/Poon.jpg";
import Nagarkot from "../Pictures/Nagarkot.jpg";
import Ghandruk from "../Pictures/Ghandruk.jpeg";
import Kalinchok from "../Pictures/Kalinchok.jpeg";
import Langtang from "../Pictures/Langtang.jpeg";
import Mustang from "../Pictures/Mustang.jpg";
import TouristVisit from "../Component/TouristVisit";

const Tourist_Areas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = [
    { src: Chitwan, title: "Explore Chitwan National Park", description: "A UNESCO World Heritage Site known for its wildlife and jungle safaris." },
    { src: Poon, title: "Travel Poon Hill", description: "Famous for its stunning sunrise views over the Himalayas." },
    { src: Nagarkot, title: "Visit Beautiful Nagarkot", description: "A hill station offering panoramic views of the Himalayas." },
    { src: Ghandruk, title: "Explore Ghandruk", description: "A picturesque village with traditional Gurung culture." },
    { src: Kalinchok, title: "Explore Kalinchok (Kuri Village)", description: "A spiritual and scenic destination with breathtaking views." },
    { src: Langtang, title: "Explore Langtang", description: "A serene valley known for its trekking routes and natural beauty." },
    { src: Mustang, title: "Explore Mustang", description: "A remote region with a unique Tibetan culture and landscapes." },
  ];

  // Auto-slide logic with progress bar
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          );
          return 0;
        }
        return prev + 10; 
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") handlePrevious();
      if (event.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lazy loading images
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = images[currentIndex].src;
    img.onload = () => setLoaded(true);
  }, [currentIndex]);

  useEffect(() => {
    const preloadImages = [
      images[(currentIndex + 1) % images.length].src,
      images[(currentIndex - 1 + images.length) % images.length].src,
    ];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [currentIndex]);

  // Touch support for mobile devices
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext(); // Swipe left
    } else if (touchEnd - touchStart > 50) {
      handlePrevious(); // Swipe right
    }
  };

  // Pause on focus loss (e.g., switching tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setProgress(0); // Reset progress bar
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0); // Reset progress bar
  };

  // Fullscreen mode
  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[100vh] w-full overflow-hidden"
      >
        {/* Background Image */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
            Loading...
          </div>
        )}
        <div
          style={{
            backgroundImage: `url(${images[currentIndex].src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            opacity: loaded ? 1 : 0, // Prevents flickering
          }}
          className="h-full w-full image-transition"
        >
          <div className="flex items-center justify-between h-full bg-black bg-opacity-40 px-4 md:px-8">
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              aria-label="Previous Slide"
              className="text-white text-2xl md:text-4xl bg-gray-800 bg-opacity-50 p-2 md:p-4 rounded-full hover:bg-opacity-80 transition-transform transform hover:scale-110"
            >
              <FaChevronLeft />
            </button>

            {/* Centered Text */}
            <div className="text-center">
              <h1 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold">
                {images[currentIndex].title}
              </h1>
              <p className="text-white text-sm md:text-lg mt-2">
                {images[currentIndex].description}
              </p>
              <button
                onClick={() => {
                }}
                className="mt-4 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all text-sm md:text-base"
              >
                Learn More
              </button>
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="text-white text-2xl md:text-4xl bg-gray-800 bg-opacity-50 p-2 md:p-4 rounded-full hover:bg-opacity-80 transition-transform transform hover:scale-110"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-1/2 md:w-1/3 h-1 bg-gray-400 rounded-full">
          <div
            className="h-1 bg-white rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-white w-3 h-3 md:w-4 md:h-4" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>

        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 text-white text-xl md:text-2xl bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
        >
          <FaExpand />
        </button>
      </div>

      <TouristVisit />
    </>
  );
};

export default Tourist_Areas;