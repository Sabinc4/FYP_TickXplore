import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

const Nav = () => {
  const [click, setClick] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    setUserLoggedIn(isLoggedIn === "true");

    const userName = localStorage.getItem("userName");
    if (userName) {
      const nameParts = userName.split(" ");
      const firstInitial = nameParts[0].charAt(0).toUpperCase();
      const lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
      setUserInitials(firstInitial + lastInitial);
    }

    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);

    const needsRefresh = localStorage.getItem("needsRefresh");
    if (needsRefresh === "true") {
      window.location.reload();
      localStorage.removeItem("needsRefresh");
    }
  }, [location]);

  const handleClick = () => setClick(!click);

  const isActive = (path) =>
    location.pathname === path ? "text-white font-bold" : "hover:text-slate-100";

  return (
    <nav className="bg-slate-900 text-slate-400 sticky top-0 z-50">
      <div className="h-10vh flex justify-between items-center lg:py-5 px-8 py-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold">TickXplore</span>
        </div>
        <div className="hidden lg:flex items-center justify-end">
          <ul className="flex gap-12 text-[18px]">
            <Link to="/" className={isActive("/")}> <li className="cursor-pointer py-4">Home</li> </Link>
            <Link to="/tourist-areas" className={isActive("/tourist-areas")}> <li className="cursor-pointer py-4">Tourist Areas</li> </Link>
            <Link to="/about-us" className={isActive("/about-us")}> <li className="cursor-pointer py-4">About Us</li> </Link>
            <Link to="/faqs" className={isActive("/faqs")}> <li className="cursor-pointer py-4">FAQs</li> </Link>
            {userLoggedIn ? (
              <div className="relative">
                <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center" onClick={() => setClick(!click)}>
                  <span className="text-xl">{userInitials}</span>
                </button>
                {click && (
                  <div className="absolute right-0 top-full bg-white shadow-lg rounded-md p-4">
                    <Link to="/profile" className="block py-2 px-4" onClick={() => setClick(false)}>Profile</Link>
                    {userRole === "user" && (
                      <>
                        <Link to="/my-bookings" className="block py-2 px-4" onClick={() => setClick(false)}>My Bookings</Link>
                        <Link to="/refunds" className="block py-2 px-4" onClick={() => setClick(false)}>Refunds</Link>
                        <Link to="/history" className="block py-2 px-4" onClick={() => setClick(false)}>History</Link>
                      </>
                    )}
                    <button className="block py-2 px-4 w-full text-left" onClick={() => {
                      localStorage.removeItem("userLoggedIn");
                      setUserLoggedIn(false);
                      setClick(false);
                      navigate("/");
                    }}>Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in">
                <button className="cursor-pointer py-4 px-6 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition">Sign In</button>
              </Link>
            )}
          </ul>
        </div>
        <div className="lg:hidden">
          <button onClick={handleClick} className="text-3xl transition">
            {click ? <FaTimes /> : <CiMenuBurger />}
          </button>
        </div>
      </div>
      {click && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-100 transition">
          <ul className="text-center text-xl p-10">
            <Link to="/" className={isActive("/")}> <li className="cursor-pointer py-4">Home</li> </Link>
            <Link to="/tourist-areas" className={isActive("/tourist-areas")}> <li className="cursor-pointer py-4">Tourist Areas</li> </Link>
            <Link to="/about-us" className={isActive("/about-us")}> <li className="cursor-pointer py-4">About Us</li> </Link>
            <Link to="/faqs" className={isActive("/faqs")}> <li className="cursor-pointer py-4">FAQs</li> </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
