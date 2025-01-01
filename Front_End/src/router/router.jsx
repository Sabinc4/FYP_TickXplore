import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../home/Home";
import AboutUs from "../Component/About";
import ScrollToTop from "../Component/ScrollToTop";

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
 


      ]
    }
]);
export default router;