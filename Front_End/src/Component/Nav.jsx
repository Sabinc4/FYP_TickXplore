import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

const Nav = () => {
  const [click, setClick] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const isActive = (path) =>
    location.pathname === path ? "text-white font-bold" : "hover:text-slate-100";

  const mobileMenu = (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-100 transition">
      <ul className="text-center text-xl p-10">
        <Link to="/" className={isActive("/")}>
          <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
            Home
          </li>
        </Link>
        <Link to="/vehicle-bookings" className={isActive("/vehicle-bookings")}>
          <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
            Vehicle Bookings
          </li>
        </Link>
        <Link to="/tourist-areas" className={isActive("/tourist-areas")}>
          <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
            Tourist Areas
          </li>
        </Link>
        <Link to="/about-us" className={isActive("/about-us")}>
          <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
            About Us
          </li>
        </Link>
        <Link to="/faqs" className={isActive("/faqs")}>
          <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
            FAQs
          </li>
        </Link>
        <div className="relative">
          <li
            className="mt-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </li>
        </div>
      </ul>
    </div>
  );

  const desktopMenu = (
    <ul className="flex gap-12 text-[18px]">
      <Link to="/" className={isActive("/")}>
        <li className="cursor-pointer">Home</li>
      </Link>
      <Link to="/vehicle-bookings" className={isActive("/vehicle-bookings")}>
        <li className="cursor-pointer">Vehicle Bookings</li>
      </Link>
      <Link to="/tourist-areas" className={isActive("/tourist-areas")}>
        <li className="cursor-pointer">Tourist Areas</li>
      </Link>
      <Link to="/about-us" className={isActive("/about-us")}>
        <li className="cursor-pointer">About Us</li>
      </Link>
      <Link to="/faqs" className={isActive("/faqs")}>
        <li className="cursor-pointer">FAQs</li>
      </Link>
      <div className="ml-0">
        <a
          href="#"
          className="bg-blue-600 text-white px-6 py-4 text-lg rounded-full hover:bg-green-700 transition"
          onClick={() => navigate("/sign-in")}
        >
          Sign In
        </a>
      </div>
    </ul>
  );

  return (
    <nav className="bg-slate-900 text-slate-400 sticky top-0 z-50">
      <div className="h-10vh flex justify-between items-center lg:py-5 px-8 py-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold">TickXplore</span>
        </div>
        <div className="hidden lg:flex items-center justify-end">
          {desktopMenu}
        </div>
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
