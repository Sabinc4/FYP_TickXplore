import Nav from "./Component/Nav";
import Footer from "./Component/Footer";
import Login from "./Component/Login";
import HomePage from "./Pages/Homepage";
import AboutUs from "./Component/About";
import Registration from "./Component/Registration";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Service_Card from "./Component/Service_Card";
import TouristVisit from "./Component/TouristVisit";


const App = () => {
  return (
    <>
      <div>
        <TouristVisit/>
      </div>
    </>
  );
}

export default App;
