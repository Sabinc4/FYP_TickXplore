import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import logo from "../Pictures/sabin-fav-icon.svg";
import { toast } from "react-toastify";

const Nav = () => {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateNav = async () => {
      const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
      const role = localStorage.getItem("userRole");
      const id =
        role === "admin"
          ? localStorage.getItem("adminId")
          : role === "vendor"
          ? localStorage.getItem("vendorId")
          : localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");

      setUserLoggedIn(isLoggedIn);
      setUserRole(role || "");

      if (userName) {
        const nameParts = userName.split(" ");
        const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
        const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || "";
        setUserInitials(firstInitial + lastInitial);
      }

      if (isLoggedIn && id && token) {
        const endpoint = role === "admin" ? "admin" : role === "vendor" ? "vendor" : "users";
        try {
          const res = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          const profile = data.admin || data.vendor || data.user;
          if (profile?.profilePhoto?.startsWith("http")) {
            setProfileImage(profile.profilePhoto);
          } else {
            setProfileImage("");
          }
        } catch (err) {
          console.error("Error fetching profile photo:", err);
          setProfileImage("");
        }
      }
    };

    updateNav();
    window.addEventListener("storageUpdate", updateNav);
    return () => window.removeEventListener("storageUpdate", updateNav);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const role = localStorage.getItem("userRole");
      const userId =
        localStorage.getItem("adminId") ||
        localStorage.getItem("vendorId") ||
        localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (userId && role && token) {
        try {
          const res = await fetch(`http://localhost:3001/api/notifications/${role}/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          setNotifications(data.data || []);
          setUnreadCount((data.data || []).filter((n) => !n.isRead).length);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };

    if (userLoggedIn) {
      fetchNotifications();
    }
  }, [userLoggedIn]);

  const isActive = (path) =>
    location.pathname === path ? "text-white font-bold" : "hover:text-slate-100";

  const handleLogout = () => {
    toast.dismiss();
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("vendorId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userName");

    setUserLoggedIn(false);
    setDropdownOpen(false);
    toast.success("Logged out successfully!");
    navigate("/sign-in");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  const markNotificationAsRead = async (notifId) => {
    try {
      await fetch(`http://localhost:3001/api/notifications/${notifId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notifId ? { ...notif, isRead: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const isVendorOrAdmin = userRole === "vendor" || userRole === "admin";

  return (
    <nav className="bg-slate-900 text-slate-400 sticky top-0 z-50">
      <div className="flex justify-between items-center lg:py-5 px-8 py-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="TickXplore Logo" className="w-10 h-10" />
        </div>

        <div className="hidden lg:flex items-center justify-end">
          <ul className="flex gap-12 text-[18px]">
            {!isVendorOrAdmin && (
              <>
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
              </>
            )}

            {userLoggedIn ? (
              <div className="relative flex items-center space-x-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    className="relative text-2xl text-white hover:text-blue-400"
                    title="Notifications"
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setDropdownOpen(false);
                    }}
                  >
                    <IoMdNotificationsOutline />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-md p-2 z-50">
                      <h3 className="font-bold text-center py-2">Notifications</h3>
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`py-2 px-4 text-sm ${notif.isRead ? "text-gray-600" : "font-bold"} hover:bg-slate-100 cursor-pointer`}
                            onClick={() => markNotificationAsRead(notif._id)}
                          >
                            {notif.message}
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-gray-400">No new notifications</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    className="w-12 h-12 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center relative"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setNotificationOpen(false);
                    }}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl text-white">{userInitials}</span>
                    )}
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full text-xs flex items-center justify-center"
                      title="Logged In"
                    >
                      ✓
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md p-2 z-50">
                      <Link
                        to="/profile"
                        className="block py-2 px-4 hover:bg-slate-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 px-4 hover:bg-slate-100"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/sign-in">
                <button className="py-3 px-6 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition">
                  Sign In
                </button>
              </Link>
            )}
          </ul>
        </div>

        {/* Hamburger for Mobile */}
        <div className="lg:hidden">
          <button onClick={() => setClick(!click)} className="text-3xl text-white">
            {click ? <FaTimes /> : <CiMenuBurger />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
