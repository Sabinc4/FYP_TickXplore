import { useState } from "react";
import { Link } from "react-scroll";
import { FaTimes } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

const Nav = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const mobileMenu = (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-100 transition">
      <ul className="text-center text-xl p-10">
        {["Home", "Bus Tickets", "Tourist Areas", "About Us"].map((item) => (
          <Link key={item} spy={true} smooth={true} to={item}>
            <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
              {item}
            </li>
          </Link>
        ))}

        {/* Vehicle Bookings with Dropdown in Mobile Menu */}
        <div className="relative">
          <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
            Vehicle Bookings
          </li>
          <ul className="text-left ml-4">
            <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
              4x4 Jeeps
            </li>
            <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
              Scorpio
            </li>
            <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
              E-vans
            </li>
          </ul>
        </div>

        {/* Add "Book Now" in the mobile menu */}
        <li className="mt-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700">
          <a href="#">Book Now</a>
        </li>
      </ul>
    </div>
  );

  return (
    <nav className="bg-slate-900 text-slate-400 sticky top-0 z-50">
      <div className="h-10vh flex justify-between items-center lg:py-5 px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-3xl font-bold">TickXplore</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-end">
          <ul className="flex gap-12 text-[18px]">
            {["Home", "Bus Tickets", "Tourist Areas", "About Us"].map((item) => (
              <Link key={item} spy={true} smooth={true} to={item}>
                <li className="hover:text-slate-100 cursor-pointer">{item}</li>
              </Link>
            ))}

            {/* Vehicle Bookings with Dropdown */}
            <div className="relative group">
              <li className="hover:text-slate-100 cursor-pointer">Vehicle Bookings</li>
              <div className="absolute left-0 top-full bg-slate-800 text-white rounded shadow-md w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-slate-700 border-b border-slate-700"
                >
                  4x4 Jeeps
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-slate-700 border-b border-slate-700"
                >
                  Scorpio
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-slate-700">
                  E-vans
                </a>
              </div>
            </div>
          </ul>
          {/* Add "Book Now" button */}
          <div className="ml-6">
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-4 rounded-full hover:bg-green-700 transition"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={handleClick} className="text-3xl transition">
            {click ? <FaTimes /> : <CiMenuBurger />}
          </button>
        </div>
      </div>
      {click && mobileMenu}
    </nav>
  );
};

export default Nav;
