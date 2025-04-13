import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../Component/Nav";
import Footer from "../Component/Footer";
import "../../src/App.css";

const Main = () => {
  return (
    <div className="bg-prigmayBG">
      <Nav />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
