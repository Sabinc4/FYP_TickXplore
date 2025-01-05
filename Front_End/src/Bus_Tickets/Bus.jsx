import React from "react";
import Bus_Tickets from "../Pages/Bus_Tickets";
import Bus_Facility from "../Component/Bus_Facility";
import Service_Card from "../Component/Service_Card";
import TouristVisit from "../Component/TouristVisit";

const Bus = () => {
  return (
    <div>
        <Bus_Tickets/>
        <Bus_Facility/>
        <Service_Card/>
        <TouristVisit/>
    </div>
  )
}

export default Bus;
