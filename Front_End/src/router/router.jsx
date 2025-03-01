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
import Admin_Dashboard from "../Pages/Admin_Dashboard";
import Vendor_Dashboard from "../Pages/Vendor_Dashboard";
import Tickets from "../Pages/tickets";
import Seat_Selection from "../Pages/Seat_Selection";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
            <ScrollToTop/>
            <Main/>
            </>    
        ),
    

    children: [
        {
          path: '/',
          element: <Home/>,
        },
        {
          path: '/tickets',
          element:<Tickets/>,
        },
        {
            path: '/about-us',
            element: <AboutUs/>,
          },
        {
            path:'/tourist-areas',
            element: <Tourist_Areas/>
        },
        {
          path:'/sign-in',
          element: <Login/>
      },
      {
        path:'/signup',
        element: <Registration/>
    },
    {
      path:'/vehicle-bookings',
      element: <Vehicle_Booking/>
  },
  {
    path:'/faqs',
    element: <FAQs/>
  },
  {
    path:'/profile',
    element: <Profile/>
  },
  {
    path:'/Admin_Dashboard',
    element: <Admin_Dashboard/>
  },
  {
    path: '/Vendor_Dashboard',
    element: <Vendor_Dashboard/>
  },
  {
    path: '/Seat_Selection/:id',
    element: <Seat_Selection />
  }
  
      ]
    }
]);


export default router;

