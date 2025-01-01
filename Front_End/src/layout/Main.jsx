import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../Component/Nav";
import "../../src/App.css";
import Footer from "../Component/Footer";


const Main = () => {

  return (
    <div className="bg-prigmayBG">
      {
       <div>
        <Nav/>
        <div className="min-h-screen">
        <Outlet />
        </div>
        <Footer/>
        </div>
      }
       
    </div>
  )
};

export default Main;