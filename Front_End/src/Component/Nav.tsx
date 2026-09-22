import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaQuestionCircle,
  FaSignInAlt,
  FaTicketAlt,
} from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiLogOut, FiUser, FiRefreshCw, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";
import type { Notification } from "../api/types";

interface NavLinkItem {
  label: string;
  path: string;
  icon: typeof FaHome;
}

const USER_LINKS: NavLinkItem[] = [
  { label: "Home", path: "/", icon: FaHome },
  { label: "Tourist Areas", path: "/tourist-areas", icon: FaMapMarkedAlt },
  { label: "About Us", path: "/about-us", icon: FaInfoCircle },
  { label: "FAQs", path: "/faqs", icon: FaQuestionCircle },
];

const Nav = () => {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bookingType, setBookingType] = useState("");
  const [bookingId, setBookingId] = useState("");

  const locationHook = useLocation();
  const navigate = useNavigate();

  const dropRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  /* ---- auth state ---- */
  const updateNav = useCallback(async () => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const role = localStorage.getItem("userRole") || "";
    const id =
      role === "admin"
        ? localStorage.getItem("adminId")
        : role === "vendor"
        ? localStorage.getItem("vendorId")
        : localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    setUserLoggedIn(isLoggedIn);
    setUserRole(role);

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
          headers: { Authorization: `Bearer ${token}` },
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
  }, []);

  useEffect(() => {
    updateNav();
    window.addEventListener("storageUpdate", updateNav);
    window.addEventListener("session-expired", () => {
      setUserLoggedIn(false);
      setUserRole("");
      toast.error("Session expired. Please log in again.");
      navigate("/sign-in");
    });
    return () => {
      window.removeEventListener("storageUpdate", updateNav);
      window.removeEventListener("session-expired", () => {});
    };
  }, [updateNav, navigate]);

  /* ---- notifications ---- */
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
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setNotifications(data.data || []);
          setUnreadCount((data.data || []).filter((n: Notification) => !n.isRead).length);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };

    fetchNotifications();
  }, []);

  /* ---- latest booking for tracking ---- */
  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
          const res = await fetch(
            `http://localhost:3001/api/refunds/my-bookings/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();

          if (data.success && data.bookings.length > 0) {
            const latestBooking = data.bookings[0];
            if (latestBooking.busId) {
              setBookingType("bus");
              setBookingId(
                typeof latestBooking.busId === "object"
                  ? latestBooking.busId._id
                  : latestBooking.busId
              );
            } else if (latestBooking.vehicleId) {
              setBookingType("vehicle");
              setBookingId(
                typeof latestBooking.vehicleId === "object"
                  ? latestBooking.vehicleId._id
                  : latestBooking.vehicleId
              );
            }
          }
        }
      } catch (err) {
        console.error("Error fetching booking info:", err);
      }
    };

    if (userLoggedIn && userRole === "user") {
      fetchBookingInfo();
    }
  }, [userLoggedIn, userRole]);

  /* ---- outside click close ---- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setNotificationOpen(false);
    setClick(false);
  }, [locationHook.pathname]);

  const isActive = (path: string) => locationHook.pathname === path;

  const handleLogout = () => {
    toast.dismiss();
    localStorage.clear();
    setUserLoggedIn(false);
    setDropdownOpen(false);
    toast.success("Logged out successfully!");
    navigate("/sign-in");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  const handleLogoClick = () => {
    if (userRole === "user") navigate("/");
    else if (userRole === "vendor") navigate("/VendorDashboard");
    else if (userRole === "admin") navigate("/Admin_Dashboard");
    else navigate("/");
  };

  const markNotificationAsRead = async (notifId: string) => {
    try {
      await fetch(`http://localhost:3001/api/notifications/${notifId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notifId ? { ...notif, isRead: true } : notif))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const renderNavLink = ({ label, path, icon: Icon }: NavLinkItem) => (
    <Link
      key={path}
      to={path}
      className={`group flex items-center gap-2 rounded-full px-4 py-2 text-[15px] transition-colors ${
        isActive(path)
          ? "bg-blue-600 text-white font-semibold shadow shadow-blue-900/40"
          : "text-slate-300 hover:text-white hover:bg-white/10"
      }`}
    >
      <Icon className="text-base" />
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-white/5 text-slate-300">
      <nav className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between py-3.5">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3"
            aria-label="TickXplore Home"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-900">
              <img
                src="/logo-slate.png"
                alt="TickXplore Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </span>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-white">
              Tick<span className="text-blue-500">Xplore</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            {!userLoggedIn && USER_LINKS.map(renderNavLink)}

            {userLoggedIn ? (
              <div className="flex items-center gap-2 pl-2">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl text-white hover:bg-white/10 transition-colors"
                    title="Notifications"
                    aria-label="Toggle notifications"
                    aria-expanded={notificationOpen}
                    onClick={() => {
                      setNotificationOpen((v) => !v);
                      setDropdownOpen(false);
                    }}
                  >
                    <IoMdNotificationsOutline />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-xl border border-slate-100 bg-white text-slate-700 shadow-card-lg">
                      <h3 className="border-b border-slate-100 bg-slate-50 py-3 text-center text-sm font-bold text-slate-700">
                        Notifications
                      </h3>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <button
                              key={notif._id}
                              className={`block w-full border-b border-slate-50 px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                                notif.isRead ? "text-slate-500" : "font-semibold text-slate-800 bg-blue-50/40"
                              }`}
                              onClick={() => markNotificationAsRead(notif._id)}
                            >
                              {notif.message}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-slate-400">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 ring-2 ring-white/20 transition hover:ring-blue-400"
                    onClick={() => {
                      setDropdownOpen((v) => !v);
                      setNotificationOpen(false);
                    }}
                    aria-expanded={dropdownOpen}
                    aria-label="Toggle profile menu"
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">{userInitials || <FiUser className="text-lg" />}</span>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 text-sm text-slate-700 shadow-card-lg">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="text-blue-500" /> Profile
                      </Link>

                      {userRole === "user" && bookingType && bookingId && (
                        <Link
                          to={`/user-dashboard/track/${bookingType}/${bookingId}`}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiRefreshCw className="text-blue-500" /> Track
                        </Link>
                      )}

                      {userRole === "user" && (
                        <>
                          <Link
                            to="/my-bookings"
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FiCreditCard className="text-blue-500" /> My Bookings
                          </Link>
                          <Link
                            to="/refunds"
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FiRefreshCw className="text-blue-500" /> Refunds
                          </Link>
                          <Link
                            to="/history"
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaTicketAlt className="text-blue-500" /> Booking History
                          </Link>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/sign-in" className="btn-primary !py-2.5">
                <FaSignInAlt /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-2xl text-white"
            onClick={() => setClick((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={click}
          >
            {click ? <FaTimes /> : <CiMenuBurger />}
          </button>
        </div>

        {/* Mobile menu */}
        {click && (
          <div className="lg:hidden animate-fade-in border-t border-white/10 py-4">
            <div className="grid gap-1">
              {!userLoggedIn &&
                USER_LINKS.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setClick(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] transition-colors ${
                      isActive(path)
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon /> {label}
                  </Link>
                ))}

              {userLoggedIn && (
                <>
                  {userRole === "user" && (
                    <Link to="/profile" onClick={() => setClick(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10">
                      <FiUser /> Profile
                    </Link>
                  )}
                  {userRole === "vendor" && (
                    <Link to="/VendorDashboard" onClick={() => setClick(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10">
                      <FaTicketAlt /> Dashboard
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link to="/Admin_Dashboard" onClick={() => setClick(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10">
                      <FaTicketAlt /> Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-400 hover:bg-red-500/10"
                  >
                    <FiLogOut /> Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Nav;