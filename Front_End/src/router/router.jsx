import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../home/Home";
import AboutUs from "../Component/About";
import ScrollToTop from "../Component/ScrollToTop";
import Tourist_Areas from "../Pages/Tourist_Areas";
import Registration from "../Component/Registration";
import Login from "../Component/Login";
import Vehicle_Booking from "../Pages/Vehicle_Booking";
import FAQs from "../Pages/FAQs";
import Profile from "../Component/Profile";
import Vehicles from "../Pages/Vendor_Dashboard/Vehicles"; 
import Buses from "../Pages/Vendor_Dashboard/Buses";
import Tickets from "../Pages/tickets";
import Seat_Selection from "../Pages/Seat_Selection";
import Vehicle_Seats from "../Pages/Vehicle_Seats";
import KhaltiPayment from "../Component/KhaltiPayment";
import PaymentCallback from "../Pages/PaymentCallback";
import MyBookings from "../Pages/MyBookings";
import ProtectedRoute from "./ProtectedRoute";
import VendorDashboard from "../Pages/Vendor_Dashboard/VendorDashboard";
import AdminDashboard from "../Pages/Admin_Dashboard/AdminDashboard";
import Admins from "../Pages/Admin_Dashboard/Admins";
import Bookings from "../Pages/Admin_Dashboard/Bookings";
import DashboardHome from "../Pages/Admin_Dashboard/DashboardHome";
import Users from "../Pages/Admin_Dashboard/Users";
import Admin_Vendors from "../Pages/Admin_Dashboard/Admin_Vendors";
import Admin_Buses from "../Pages/Admin_Dashboard/Admin_Buses";
import Admin_Vehicles from "../Pages/Admin_Dashboard/Admin_Vehicles";
import RefundRequestModal from "../Component/RefundRequestModal";

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
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tickets",
        element: <Tickets />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/tourist-areas",
        element: <Tourist_Areas />,
      },
      {
        path: "/sign-in",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Registration />,
      },
      {
        path: "/vehicle-bookings",
        element: <Vehicle_Booking />,
      },
      {
        path: "/faqs",
        element: <FAQs />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/Admin_Dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome/>,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "Vendors",
            element: <Admin_Vendors />,
          },
          {
            path: "admins",
            element: <Admins />,
          },
          {
            path: "Buses",
            element: <Admin_Buses/>,
          },
          {
            path: "vehicles",
            element: <Admin_Vehicles/>,
          },
          {
            path: "bookings",
            element: <Bookings />,
          },
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
          {
            path: "vehicles",
            element: <Vehicles />,
          },
          {
            path: "buses",
            element: <Buses />,
          },
        ],
      },
      {
        path: "/Seat_Selection/:id",
        element: <Seat_Selection />,
      },
      {
        path: "/Vehicle/:id",
        element: <Vehicle_Seats />,
      },
      {
        path: "/payment",
        element: <KhaltiPayment />,
      },
      {
        path: "/payment/callback",
        element: <PaymentCallback />,
      },
      {
        path: "my-bookings",
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
            <RefundRequestModal />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;