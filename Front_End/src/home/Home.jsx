import React from "react";
import HomePage from "../Pages/Homepage";
import Bus_Facility from "../Component/Bus_Facility";
import Service_Card from "../Component/Service_Card";
import TouristVisit from "../Component/TouristVisit";
const Home = () => {
  return (
    <div>
      <HomePage/>
      <Bus_Facility/>
      <Service_Card/>
      <TouristVisit/>
    </div>
  )
}

export default Home;
