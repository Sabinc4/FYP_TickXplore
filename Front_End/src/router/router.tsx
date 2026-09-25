import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import ScrollToTop from "../Component/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
// Pages
import Home from "../Pages/Home Pages/Home";
import AboutUs from "../Pages/Home Pages/About";
import Tourist_Areas from "../Pages/Tourist_Areas";
import TouristBlog from "../blogs/TouristBlog";
import Registration from "../Component/Registration";
import Login from "../Component/Login";
import Vehicle_Booking from "../Pages/Vehicle_Booking";
import FAQs from "../Pages/Home Pages/FAQs";
import Profile from "../Component/Profile";
import Tickets from "../Pages/tickets";
import Seat_Selection from "../Pages/Seat_Selection";
import Vehicle_Seats from "../Pages/Vehicle_Seats";
import KhaltiPayment from "../Component/KhaltiPayment";
import PaymentCallback from "../Pages/PaymentCallback";
import MyBookings from "../Pages/MyBookings";
import Refunds from "../Pages/refund";
import History from "../Pages/History";
import LiveTracker from "../Pages/LiveTracker";
import NoPage from "../Pages/NoPage";

// Lazy-loaded dashboards for code-splitting
const AdminDashboard = lazy(() => import("../Pages/Admin_Dashboard/AdminDashboard"));
const VendorDashboard = lazy(() => import("../Pages/Vendor_Dashboard/VendorDashboard"));

// Lazy-loaded accommodation (Stay) page
const AccommodationPage = lazy(() => import("../Pages/AccommodationPage"));
const AccommodationDetails = lazy(() => import("../Pages/AccommodationDetails"));

/* Lazy admin / vendor sub-routes (must be declared before `router` uses them) */
const DashboardChildren = {
  Home: lazy(() => import("../Pages/Admin_Dashboard/DashboardHome")),
  Users: lazy(() => import("../Pages/Admin_Dashboard/Users")),
  Vendors: lazy(() => import("../Pages/Admin_Dashboard/Admin_Vendors")),
  VendorApplications: lazy(() => import("../Pages/Admin_Dashboard/Admin_VendorApplications")),
  Buses: lazy(() => import("../Pages/Admin_Dashboard/Admin_Buses")),
  Vehicles: lazy(() => import("../Pages/Admin_Dashboard/Admin_Vehicles")),
  Bookings: lazy(() => import("../Pages/Admin_Dashboard/Bookings")),
  Refunds: lazy(() => import("../Pages/Admin_Dashboard/Admin_Refund")),
  Admins: lazy(() => import("../Pages/Admin_Dashboard/Admin_Admins")),
  VendorVehicles: lazy(() => import("../Pages/Vendor_Dashboard/Vehicles")),
  VendorBuses: lazy(() => import("../Pages/Vendor_Dashboard/Buses")),
  VendorBookings: lazy(() => import("../Pages/Vendor_Dashboard/Bookings")),
};

const PageFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Main />
      </>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/tickets", element: <Tickets /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/tourist-areas", element: <Tourist_Areas /> },
      { path: "/blogs/:slug", element: <TouristBlog /> },
      { path: "/sign-in", element: <Login /> },
      { path: "/signup", element: <Registration /> },
      { path: "/vehicle-bookings", element: <Vehicle_Booking /> },
      { path: "/faqs", element: <FAQs /> },
      { path: "/profile", element: <Profile /> },

      {
        path: "/user-dashboard/track/:type/:id",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <LiveTracker />
          </ProtectedRoute>
        ),
      },

      {
        path: "/stay",
        element: (
          <Suspense fallback={<PageFallback />}>
            <AccommodationPage />
          </Suspense>
        ),
      },
      {
        path: "/stay/:id",
        element: (
          <Suspense fallback={<PageFallback />}>
            <AccommodationDetails />
          </Suspense>
        ),
      },
      { path: "/Seat_Selection/:id", element: <Seat_Selection /> },
      { path: "/vehicle/:id", element: <Vehicle_Seats /> },
      { path: "/payment", element: <KhaltiPayment /> },
      { path: "/payment/callback", element: <PaymentCallback /> },

      {
        path: "/my-bookings",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/refunds",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <Refunds />
          </ProtectedRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <History />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NoPage /> },
    ],
  },
  {
    path: "/Admin_Dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Suspense fallback={<PageFallback />}>
          <AdminDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardChildren.Home /> },
      { path: "users", element: <DashboardChildren.Users /> },
      { path: "vendors", element: <DashboardChildren.Vendors /> },
      { path: "vendor-applications", element: <DashboardChildren.VendorApplications /> },
      { path: "buses", element: <DashboardChildren.Buses /> },
      { path: "vehicles", element: <DashboardChildren.Vehicles /> },
      { path: "bookings", element: <DashboardChildren.Bookings /> },
      { path: "admins", element: <DashboardChildren.Admins /> },
      { path: "refunds", element: <DashboardChildren.Refunds /> },
    ],
  },
  {
    path: "/VendorDashboard",
    element: (
      <ProtectedRoute allowedRoles={["vendor"]}>
        <Suspense fallback={<PageFallback />}>
          <VendorDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: "vehicles", element: <DashboardChildren.VendorVehicles /> },
      { path: "buses", element: <DashboardChildren.VendorBuses /> },
      { path: "bookings", element: <DashboardChildren.VendorBookings /> },
    ],
  },
]);

export default router;