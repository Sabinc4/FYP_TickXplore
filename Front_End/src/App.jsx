import Nav from "./Component/Nav";
import Footer from "./Component/Footer";
import Login from "./Component/Login";
import HomePage from "./Pages/Homepage";


const App = () => {
  return (
    <>
      <div>
        <Nav/>
        <HomePage/>
        <Login/>
        <Footer/>
        
      </div>
    </>
  );
}

export default App;
