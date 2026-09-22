import { Outlet } from "react-router-dom";
import Nav from "../Component/Nav";
import Footer from "../Component/Footer";

const Main = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;