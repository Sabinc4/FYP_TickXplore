import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

const Nav = () => {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateNav = () => {
      const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
      setUserLoggedIn(isLoggedIn);
      const userName = localStorage.getItem("userName");
      if (userName) {
        const nameParts = userName.split(" ");
        const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
        const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || "";
        setUserInitials(firstInitial + lastInitial);
      }
      const role = localStorage.getItem("userRole");
      setUserRole(role || "");
    };
  
    updateNav(); 
    window.addEventListener("storageUpdate", updateNav);
    return () => {
      window.removeEventListener("storageUpdate", updateNav);
    };
  }, []);
  

  const isActive = (path) =>
    location.pathname === path ? "text-white font-bold" : "hover:text-slate-100";
  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setUserLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };
  return (
    <nav className="bg-slate-900 text-slate-400 sticky top-0 z-50">
      <div className="flex justify-between items-center lg:py-5 px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-3xl font-bold text-white">TickXplore</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-end">
          <ul className="flex gap-12 text-[18px]">
            <Link to="/" className={isActive("/")}>
              <li className="cursor-pointer py-4">Home</li>
            </Link>
            <Link to="/tourist-areas" className={isActive("/tourist-areas")}>
              <li className="cursor-pointer py-4">Tourist Areas</li>
            </Link>
            <Link to="/about-us" className={isActive("/about-us")}>
              <li className="cursor-pointer py-4">About Us</li>
            </Link>
            <Link to="/faqs" className={isActive("/faqs")}>
              <li className="cursor-pointer py-4">FAQs</li>
            </Link>

            {/* Avatar & Dropdown */}
            {userLoggedIn ? (
              <div className="relative">
                <button
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center relative"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="text-xl">{userInitials}</span>
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs"
                    title="Logged In"
                  >
                    ✓
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md p-2 z-50">
                    <Link to="/profile" className="block py-2 px-4 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>
                      Profile
                    </Link>
                    {userRole === "user" && (
                      <>
                        <Link to="/my-bookings" className="block py-2 px-4 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>
                          My Bookings
                        </Link>
                        <Link to="/refunds" className="block py-2 px-4 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>
                          Refunds
                        </Link>
                        <Link to="/history" className="block py-2 px-4 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>
                          History
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="w-full text-left py-2 px-4 hover:bg-slate-100">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in">
                <button className="py-2 px-6 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition">
                  Sign In
                </button>
              </Link>
            )}
          </ul>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button onClick={() => setClick(!click)} className="text-3xl text-white">
            {click ? <FaTimes /> : <CiMenuBurger />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {click && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-100 transition z-40">
          <ul className="text-center text-xl p-10">
            <Link to="/" className={isActive("/")}>
              <li className="cursor-pointer py-4">Home</li>
            </Link>
            <Link to="/tourist-areas" className={isActive("/tourist-areas")}>
              <li className="cursor-pointer py-4">Tourist Areas</li>
            </Link>
            <Link to="/about-us" className={isActive("/about-us")}>
              <li className="cursor-pointer py-4">About Us</li>
            </Link>
            <Link to="/faqs" className={isActive("/faqs")}>
              <li className="cursor-pointer py-4">FAQs</li>
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
