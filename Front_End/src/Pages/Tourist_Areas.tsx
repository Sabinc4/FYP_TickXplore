import { useState, useEffect, useCallback, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";
import Chitwan from "../Pictures/Chitwan.jpg";
import Poon from "../Pictures/Poon.jpg";
import Nagarkot from "../Pictures/Nagarkot.jpg";
import Ghandruk from "../Pictures/Ghandruk.jpeg";
import Kalinchok from "../Pictures/Kalinchok.jpeg";
import Langtang from "../Pictures/Langtang.jpeg";
import Mustang from "../Pictures/Mustang.jpg";
import TouristVisit from "../Component/TouristVisit";

interface Slide {
  src: string;
  title: string;
  description: string;
}

const IMAGES: Slide[] = [
  {
    src: Chitwan,
    title: "Explore Chitwan National Park",
    description:
      "A UNESCO World Heritage Site known for its wildlife and jungle safaris.",
  },
  {
    src: Poon,
    title: "Travel Poon Hill",
    description: "Famous for its stunning sunrise views over the Himalayas.",
  },
  {
    src: Nagarkot,
    title: "Visit Beautiful Nagarkot",
    description: "A hill station offering panoramic views of the Himalayas.",
  },
  {
    src: Ghandruk,
    title: "Explore Ghandruk",
    description: "A picturesque village with traditional Gurung culture.",
  },
  {
    src: Kalinchok,
    title: "Explore Kalinchok (Kuri Village)",
    description: "A spiritual and scenic destination with breathtaking views.",
  },
  {
    src: Langtang,
    title: "Explore Langtang",
    description: "A serene valley known for its trekking routes and natural beauty.",
  },
  {
    src: Mustang,
    title: "Explore Mustang",
    description: "A remote region with a unique Tibetan culture and landscapes.",
  },
];

const Tourist_Areas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(((index % IMAGES.length) + IMAGES.length) % IMAGES.length);
    setProgress(0);
  }, []);

  const handlePrevious = useCallback(() => {
    goTo(currentIndex - 1);
     
  }, [currentIndex, goTo]);

  const handleNext = useCallback(() => {
    goTo(currentIndex + 1);
     
  }, [currentIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex === IMAGES.length - 1 ? 0 : prevIndex + 1));
          return 0;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handlePrevious();
      if (event.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = IMAGES[currentIndex].src;
    img.onload = () => setLoaded(true);
    return () => {
      img.onload = null;
    };
  }, [currentIndex]);

  useEffect(() => {
    const preloadImages = [
      IMAGES[(currentIndex + 1) % IMAGES.length].src,
      IMAGES[(currentIndex - 1 + IMAGES.length) % IMAGES.length].src,
    ];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [currentIndex]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
        onTouchStart={(e) => {
          touchStart.current = e.targetTouches[0].clientX;
        }}
        onTouchMove={(e) => {
          touchEnd.current = e.targetTouches[0].clientX;
        }}
        onTouchEnd={() => {
          if (touchStart.current - touchEnd.current > 50) {
            handleNext();
          } else if (touchEnd.current - touchStart.current > 50) {
            handlePrevious();
          }
        }}
        className="relative h-[100vh] w-full overflow-hidden"
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl text-white">
            Loading...
          </div>
        )}
        <div
          style={{
            backgroundImage: `url(${IMAGES[currentIndex].src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            opacity: loaded ? 1 : 0,
          }}
          className="h-full w-full"
        >
          <div className="flex h-full items-center justify-between bg-black/40 px-4 md:px-8">
            <button
              onClick={handlePrevious}
              aria-label="Previous Slide"
              className="rounded-full bg-gray-800/50 p-2 text-2xl text-white transition-transform hover:scale-110 hover:bg-gray-800/80 md:p-4 md:text-4xl"
            >
              <FaChevronLeft />
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white drop-shadow md:text-4xl lg:text-6xl">
                {IMAGES[currentIndex].title}
              </h1>
              <p className="mt-2 text-sm text-white/90 md:text-lg">
                {IMAGES[currentIndex].description}
              </p>
              <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm text-slate-900 transition-all hover:bg-gray-200 md:text-base">
                Learn More
              </button>
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="rounded-full bg-gray-800/50 p-2 text-2xl text-white transition-transform hover:scale-110 hover:bg-gray-800/80 md:p-4 md:text-4xl"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-gray-400 md:w-1/3">
          <div
            className="h-1 rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 md:h-3 md:w-3 ${
                currentIndex === index
                  ? "h-3 w-3 bg-white md:h-4 md:w-4"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          className="absolute top-4 right-4 rounded-full bg-gray-800/50 p-2 text-xl text-white transition hover:bg-gray-800/80 md:text-2xl"
        >
          <FaExpand />
        </button>
      </div>

      <TouristVisit />
    </>
  );
};

export default Tourist_Areas;