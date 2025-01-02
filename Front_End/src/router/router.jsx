import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../home/Home";
import AboutUs from "../Component/About";
import ScrollToTop from "../Component/ScrollToTop";
import Tourist_Areas from "../Pages/Tourist_Areas";
import Registration from "../Component/Registration";
import Login from "../Component/Login";

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


 


      ]
    }
]);
export default router;