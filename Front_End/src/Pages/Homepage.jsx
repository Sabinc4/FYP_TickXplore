import React, { useState, useEffect, useRef } from "react";
import Hill from "../Pictures/Hill.jpg";
import { FaMapMarkerAlt, FaCaretDown, FaSearch, FaCar, FaCreditCard, FaStar,FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaWifi, FaBed, FaCogs, FaGlassCheers } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
//Images
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


// Reusable Card Component
const Card = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-900 shadow-xl rounded-md p-8 text-center flex flex-col items-center justify-between min-h-[250px] hover:scale-105 transition-transform duration-300">
    <Icon className="text-5xl text-white mb-4" />
    <h2 className="font-bold text-lg text-white mb-4">{title}</h2>
    <p className="text-sm text-white">{description}</p>
  </div>
);

const HomePage = () => {
  const [formData, setFormData] = useState({
    pickupPoint: "",
    droppingPoint: "",
    date: "",
  });

  // Set today's date as the default when the component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format as yyyy-mm-dd
    setFormData((prevData) => ({ ...prevData, date: formattedDate }));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching tickets with data:", formData);
    alert(
      `Searching tickets from ${formData.pickupPoint} to ${formData.droppingPoint} on ${formData.date}`
    );
  };

  // Tourist Areas Scroll Management
  const scrollRef = useRef(null); 
  const scrollAmount = 350; 

  // Handle scrolling to the left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollAmount;
    }
  };

  // Handle scrolling to the right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full h-[80vh] relative overflow-hidden shadow-lg">
        <img
          src={Hill}
          alt="Homepage Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-[30%] px-4 text-center">
          <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold">
            Ride your Future with TickXplore
          </h2>
        </div>
        <div className="absolute inset-x-0 top-[40%] px-4">
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="relative">
                  <label
                    htmlFor="pickupPoint"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Pickup Point
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="text"
                      id="pickupPoint"
                      name="pickupPoint"
                      value={formData.pickupPoint}
                      onChange={handleChange}
                      placeholder="Pickup point"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      required
                    />
                    <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="droppingPoint"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Dropping Point
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="text"
                      id="droppingPoint"
                      name="droppingPoint"
                      value={formData.droppingPoint}
                      onChange={handleChange}
                      placeholder="Dropping point"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      required
                    />
                    <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end sm:col-span-2 md:col-span-1">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaSearch className="text-2xl" /> Find Tickets
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="px-3 mt-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Get Your Tickets in 3 Easy Steps
          </h1>
          <p className="mt-4 text-gray-600">
            Discover why we’re the best choice for your travel needs. With easy
            booking and trusted services, you can make your trips unforgettable!
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[ 
            {
              icon: FaSearch,
              title: "Search Your Vehicle",
              description: "Quickly search for buses by selecting origin, destination, and travel date. Whether you're looking for local or long-distance options, our platform lets you find buses that meet your schedule, route, and seating preferences.",
            },
            {
              icon: FaCar,
              title: "Choose Your Seat",
              description: "Enjoy a hassle-free journey by choosing the seat that suits you best. With various seating options like regular, luxury, and sleeper buses, you can select the perfect seat based on your comfort needs, journey length, and budget.",
            },
            {
              icon: FaCreditCard,
              title: "Pay and Relax",
              description: "Securely pay online for your ticket and confirm your booking instantly. Skip the long lines at bus terminals and enjoy peace of mind with our easy and safe payment process, ensuring your seat is booked in a matter of minutes.",
            },
          ].map((card, index) => (
            <div key={index} className="max-w-sm mx-auto">
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 mt-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Our Services</h1>
          <p className="mt-4 text-gray-600">
            Have a look at our popular reasons why you should choose our buses. Just choose a bus and get a ticket for your great journey!
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="max-w-sm mx-auto">
            <Card
              icon={FaWifi}
              title="Free WiFi"
              description="Enjoy high-speed WiFi on board to stay connected throughout your journey."
            />
          </div>
          <div className="max-w-sm mx-auto">
            <Card
              icon={FaBed}
              title="Comfortable Pillow"
              description="Relax with comfortable pillows for a more pleasant and restful ride."
            />
          </div>
          <div className="max-w-sm mx-auto">
            <Card
              icon={FaCogs}
              title="Water Bottle"
              description="Stay refreshed with a complimentary water bottle provided during your journey."
            />
          </div>
        </div>
      </div>
            <div className="px-3 mt-10">
              <div className="text-center max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Explore Popular Tourist Areas
                </h1>
                <p className="mt-4 text-gray-600">
                  Discover Nepal’s stunning tourist destinations and plan your next adventure with us!
                </p>
              </div>
              <div className="relative mt-6">
                <button
                  onClick={() => document.getElementById('tourist-cards').scrollBy({ left: -350, behavior: 'smooth' })}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full z-10"
                >
                  <FaChevronLeft />
                </button>
                <div
                  id="tourist-cards"
                  className="flex overflow-x-auto overflow-y-hidden gap-10 scroll-smooth pb-5 px-20 py-5"
                  style={{
                    scrollbarWidth: 'none', /* For Firefox */
                    msOverflowStyle: 'none', /* For IE and Edge */
                  }}
                >
                    {[
                    {
                      image: Poon,
                      title: "Poon Hill",
                      description:
                        "A famous viewpoint offering panoramic views of the Annapurna and Dhaulagiri mountain ranges.",
                      price: "1000 NPR",
                      rating: 4.8,
                    },
                    {
                      image: Ghandruk,
                      title: "Ghandruk",
                      description:
                        "A picturesque village with traditional Gurung culture, offering amazing views of the Annapurna range.",
                      price: "1500 NPR",
                      rating: 4.7,
                    },
                    {
                      image: Chitwan,
                      title: "Chitwan",
                      description:
                        "A UNESCO World Heritage Site, famous for its wildlife safari experiences, including rhinos, tigers, and elephants.",
                      price: "1500 NPR",
                      rating: 4.7,
                    },
                    {
                      image: Pokhara,
                      title: "Pokhara",
                      description:
                        "A scenic lakeside city known for adventure sports, trekking, and breathtaking views of the Himalayas.",
                      price: "800 NPR",
                      rating: 4.9,
                    },
                    {
                      image: Namo_Buddha,
                      title: "Namo Buddha",
                      description:
                        "A sacred Buddhist site with a beautiful monastery and breathtaking views of the surrounding hills.",
                      price: "500 NPR",
                      rating: 4.5,
                    },
                    {
                      image: Mustang,
                      title: "Mustang",
                      description:
                        "A remote region offering a unique Tibetan culture, ancient monasteries, and incredible landscapes.",
                      price: "2000 NPR",
                      rating: 4.7,
                    },
                    {
                      image: Kalinchok,
                      title: "Kalinchok",
                      description:
                        "A popular pilgrimage site with stunning views of the Himalayas, often visited for its temple and snow activities.",
                      price: "600 NPR",
                      rating: 4.4,
                    },
                    {
                      image: Nagarkot,
                      title: "Nagarkot",
                      description:
                        "Famous for its panoramic sunrise views of the Everest range, offering a peaceful retreat near Kathmandu.",
                      price: "500 NPR",
                      rating: 4.5,
                    },
                    {
                      image: Langtang,
                      title: "Langtang",
                      description:
                        "A beautiful trekking destination known for its stunning views of the Langtang mountain range and Tamang culture.",
                      price: "1500 NPR",
                      rating: 4.6,
                    },
                    {
                      image: Rara,
                      title: "Rara",
                      description:
                        "Nepal's largest lake, located in a remote and peaceful area, offering scenic views and a serene environment.",
                      price: "1800 NPR",
                      rating: 4.8,
                    }
                  ].map((area, index) => (
                    <div
                      key={index}
                      className="min-w-[400px] max-w-[450px] bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={area.image}
                        alt={area.title}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <h2 className="font-bold text-lg text-black mb-2">{area.title}</h2>
                      <p className="text-gray-600 text-sm mb-2">{area.description}</p>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className={`${
                              starIndex < Math.floor(area.rating)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        {area.rating % 1 !== 0 && (
                          <FaStarHalfAlt className="text-yellow-500" />
                        )}
                      </div>
                      <p className="text-gray-800 font-medium">Price: {area.price}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => document.getElementById('tourist-cards').scrollBy({ left: 350, behavior: 'smooth' })}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full z-10"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
      </div>
  );
};

export default HomePage;
