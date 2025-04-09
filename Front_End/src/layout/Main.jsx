import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "../Component/Nav";
import Footer from "../Component/Footer";
import "../../src/App.css";

const Main = () => {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/Admin_Dashboard") ||
    location.pathname.startsWith("/VendorDashboard");

  return (
    <div className="bg-prigmayBG">
      {!isDashboardRoute && <Nav />}
      <div className="min-h-screen">
        <Outlet />
      </div>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

export default Main;
