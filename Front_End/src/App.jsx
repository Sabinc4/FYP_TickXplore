import Nav from "./Component/Nav";
import Footer from "./Component/Footer";
import Login from "./Component/Login";
import HomePage from "./Pages/Homepage";
import AboutUs from "./Component/About";
import Registration from "./Component/Registration";


const App = () => {
  return (
    <>
      <div>
        <Nav/>
        <Registration/>
        <Footer/>  
      </div>
    </>
  );
}

export default App;
