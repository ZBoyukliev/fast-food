import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./components/HomePage/Home";
import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
