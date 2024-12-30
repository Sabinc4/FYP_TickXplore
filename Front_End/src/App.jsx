import React from 'react'
import Nav from "./Component/Nav";
import Footer from "./Component/Footer";
import Login from "./Component/Login";
import HomePage from "./Pages/Homepage";
import AboutUs from "./Component/About";
import Registration from "./Component/Registration";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Service_Card from "./Component/Service_Card";
import TouristVisit from "./Component/TouristVisit";
import Bus_Facility from './Component/Bus_Facility';
import Tourist_Areas from './Pages/Tourist_Areas';


function App() {
  return (
<>
<Nav/>
<AboutUs/>
<Footer/>
</>


  )
}

export default App

