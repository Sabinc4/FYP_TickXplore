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
        {["Home", "About", "Bookings", "Sign-In", "Register"].map((item) => (
          <Link key={item} spy={true} smooth={true} to={item}>
            <li className="my-4 py-4 border-b border-gray-600 hover:bg-slate-600 hover:rounded cursor-pointer">
              {item}
            </li>
          </Link>
        ))}
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
        {["Home", "About", "Bookings", "Sign-In", "Register"].map((item) => (
          <Link key={item} spy={true} smooth={true} to={item}>
          <li className="hover:text-slate-100  cursor-pointer">
          {item}
          </li>
        </Link>
         ))}
        </ul>
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
