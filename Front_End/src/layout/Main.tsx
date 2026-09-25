import { Navigate, Outlet, useLocation } from "react-router-dom";
import Nav from "../Component/Nav";
import Footer from "../Component/Footer";
import ScrollToTopButton from "../Component/ScrollToTopButton";

const ROLE_DASHBOARDS: Record<string, string> = {
  vendor: "/VendorDashboard",
  admin: "/Admin_Dashboard",
};

/* Dashboard users are only allowed on these public-zone paths. Everything else
   under the public layout redirects them straight back to their dashboard. */
const ALLOWED_PATHS = new Set(["/sign-in", "/signup", "/profile", "/payment/callback"]);

const Main = () => {
  const location = useLocation();
  const role = localStorage.getItem("userRole") || "";
  const dashboard = ROLE_DASHBOARDS[role];

  if (dashboard && !ALLOWED_PATHS.has(location.pathname)) {
    return <Navigate to={dashboard} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Main;