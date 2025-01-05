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
        <Link to="/bus-tickets" className={isActive("/bus-tickets")}>
          <li className="my-4 py-4 border-b border-gray-500 hover:bg-slate-600 hover:rounded cursor-pointer">
            Bus Tickets
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
        <div className="relative">
          <Link to="/vehicle-bookings" className={isActive("/vehicle-bookings")}>
            <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
              Vehicle Bookings
            </li>
          </Link>
          <ul className="text-left ml-4">
            <Link to="/4x4-jeeps" className={isActive("/4x4-jeeps")}>
              <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
                4x4 Jeeps
              </li>
            </Link>
            <Link to="/scorpio" className={isActive("/scorpio")}>
              <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
                Scorpio
              </li>
            </Link>
            <Link to="/e-vans" className={isActive("/e-vans")}>
              <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
                E-vans
              </li>
            </Link>
          </ul>
        </div>
        <li
          className="mt-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700"
          onClick={() => navigate("/sign-in")}
        >
          Sign In
        </li>
      </ul>
    </div>
  );

  const desktopMenu = (
    <ul className="flex gap-12 text-[18px]">
      <Link to="/" className={isActive("/")}>
        <li className="cursor-pointer">Home</li>
      </Link>
      <Link to="/bus-tickets" className={isActive("/bus-tickets")}>
        <li className="cursor-pointer">Bus Tickets</li>
      </Link>
      <Link to="/tourist-areas" className={isActive("/tourist-areas")}>
        <li className="cursor-pointer">Tourist Areas</li>
      </Link>
      <Link to="/about-us" className={isActive("/about-us")}>
        <li className="cursor-pointer">About Us</li>
      </Link>
      <div className="relative group">
        <Link to="/vehicle-bookings" className={isActive("/vehicle-bookings")}>
          <li className="cursor-pointer">Vehicle Bookings</li>
        </Link>
        <div className="absolute left-0 top-full bg-slate-800 text-white rounded shadow-md w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
          <Link to="/4x4-jeeps" className={isActive("/4x4-jeeps")}>
            <a className="block px-4 py-2 hover:bg-slate-700 border-b border-slate-700">
              4x4 Jeeps
            </a>
          </Link>
          <Link to="/scorpio" className={isActive("/scorpio")}>
            <a className="block px-4 py-2 hover:bg-slate-700 border-b border-slate-700">
              Scorpio
            </a>
          </Link>
          <Link to="/e-vans" className={isActive("/e-vans")}>
            <a className="block px-4 py-2 hover:bg-slate-700">E-vans</a>
          </Link>
        </div>
      </div>

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
