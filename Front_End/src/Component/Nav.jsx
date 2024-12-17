import { useState } from "react";
import { Link } from "react-scroll";
import { FaTimes } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

const Nav = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const mobileMenu = (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-900 transition">
      <ul className="text-center text-xl p-10">
        {["Home", "About", "Bookings", "Sign-In", "Register"].map((item) => (
          <Link key={item} spy={true} smooth={true} to={item}>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
              {item}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );

  return (
    <nav className="bg-slate-900 text-white">
      <div className="h-10vh flex justify-between items-center lg:py-5 px-8 py-4 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-3xl font-bold">TickXplore</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-end">
          <ul className="flex gap-8 text-[18px]">
            {["Home", "About", "Bookings", "Sign-In", "Register"].map((item) => (
              <Link key={item} spy={true} smooth={true} to={item}>
                <li className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer">
                  {item}
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={handleClick} className="text-3xl transition">
            {click ? <FaTimes /> : <CiMenuBurger />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {click && mobileMenu}
    </nav>
  );
};

export default Nav;
