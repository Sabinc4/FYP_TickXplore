import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaBus, FaCar, FaLeaf } from "react-icons/fa";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Tourist Areas", to: "/tourist-areas" },
  { label: "FAQs", to: "/faqs" },
];

const VEHICLE_LINKS = [
  { label: "Book Bus Tickets", to: "/tickets" },
  { label: "Vehicle Booking", to: "/vehicle-bookings" },
  { label: "My Bookings", to: "/my-bookings" },
  { label: "Track Live", to: "/history" },
];

const SUPPORT_LINKS = [
  { label: "Sign In", to: "/sign-in" },
  { label: "Create Account", to: "/signup" },
  { label: "Refunds", to: "/refunds" },
  { label: "Vehicle Seats", to: "/vehicle-bookings" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo-slate.png" alt="TickXplore" className="h-9 w-9 rounded-full object-cover" />
              <span className="text-xl font-bold text-white">
                Tick<span className="text-blue-500">Xplore</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your One-Stop Solution for Seamless Ticket Booking. Explore Nepal
              with ease — buses, tourist spots, or 4x4 rides. Travel Made
              Simple!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
              <FaBus className="text-blue-400" /> Quick Links
            </h6>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 transition-colors hover:text-blue-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Bookings */}
          <div>
            <h6 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
              <FaCar className="text-blue-400" /> Vehicle Bookings
            </h6>
            <ul className="space-y-2.5 text-sm">
              {VEHICLE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 transition-colors hover:text-blue-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
              <FaLeaf className="text-blue-400" /> Support
            </h6>
            <ul className="space-y-2.5 text-sm">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 transition-colors hover:text-blue-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="border-t border-white/5 bg-slate-950/40 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <span className="text-xs text-slate-500">
            © {year} TickXplore — All Rights Reserved
          </span>
          <div className="flex gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-400 transition-colors hover:text-blue-400"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-400 transition-colors hover:text-pink-400"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 transition-colors hover:text-blue-400"
            >
              <FaLinkedin size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;