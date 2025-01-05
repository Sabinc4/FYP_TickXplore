import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../home/Home";
import AboutUs from "../Component/About";
import ScrollToTop from "../Component/ScrollToTop";
import Tourist_Areas from "../Pages/Tourist_Areas";
import Registration from "../Component/Registration";
import Login from "../Component/Login";
import Bus from "../Bus_Tickets/Bus";
import Vehicle_Booking from "../Pages/Vehicle_Booking";

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
      path: "/bus-tickets",
      element: (
          <>
          <ScrollToTop/>
          <Bus/>
          </>    
    )
    },
    {
      path:'/vehicle-bookings',
      element: <Vehicle_Booking/>
  }


      ]
    }
]);


export default router;

