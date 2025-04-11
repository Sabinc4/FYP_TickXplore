import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import ScrollToTop from "../Component/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
// Pages
import Home from "../home/Home";
import AboutUs from "../Component/About";
import Tourist_Areas from "../Pages/Tourist_Areas";
import Registration from "../Component/Registration";
import Login from "../Component/Login";
import Vehicle_Booking from "../Pages/Vehicle_Booking";
import FAQs from "../Pages/FAQs";
import Profile from "../Component/Profile";
import Tickets from "../Pages/tickets";
import Seat_Selection from "../Pages/Seat_Selection";
import Vehicle_Seats from "../Pages/Vehicle_Seats";
import KhaltiPayment from "../Component/KhaltiPayment";
import PaymentCallback from "../Pages/PaymentCallback";
import MyBookings from "../Pages/MyBookings";
import Refunds from "../Pages/refund";
import History from "../Pages/History";
// Vendor Dashboard
import VendorDashboard from "../Pages/Vendor_Dashboard/VendorDashboard";
import Vehicles from "../Pages/Vendor_Dashboard/Vehicles"; 
import Buses from "../Pages/Vendor_Dashboard/Buses";
import Bookings from "../Pages/Admin_Dashboard/Bookings";
// Admin Dashboard
import AdminDashboard from "../Pages/Admin_Dashboard/AdminDashboard";
import Admins from "../Pages/Admin_Dashboard/Admins";
import DashboardHome from "../Pages/Admin_Dashboard/DashboardHome";
import Users from "../Pages/Admin_Dashboard/Users";
import Admin_Vendors from "../Pages/Admin_Dashboard/Admin_Vendors";
import Admin_Buses from "../Pages/Admin_Dashboard/Admin_Buses";
import Admin_Vehicles from "../Pages/Admin_Dashboard/Admin_Vehicles";

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
      { path: "/sign-in", element: <Login /> },
      { path: "/signup", element: <Registration /> },
      { path: "/vehicle-bookings", element: <Vehicle_Booking /> },
      { path: "/faqs", element: <FAQs /> },
      { path: "/profile", element: <Profile /> },

      {
        path: "/Admin_Dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "users", element: <Users /> },
          { path: "vendors", element: <Admin_Vendors /> },
          { path: "admins", element: <Admins /> },
          { path: "buses", element: <Admin_Buses /> },
          { path: "vehicles", element: <Admin_Vehicles /> },
          { path: "bookings", element: <Bookings /> },
          { path: "history", element: <History /> },
        ],
      },

      {
        path: "/VendorDashboard",
        element: (
          <ProtectedRoute allowedRoles={["vendor"]}>
            <VendorDashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "vehicles", element: <Vehicles /> },
          { path: "buses", element: <Buses /> },
          { path: "bookings", element: <Bookings /> },
        ],
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
    ],
  },
]);

export default router;
