import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Menu from './components/Menu/Menu';
import Burger from './components/Menu/Burger/Burger';
import Chicken from './components/Menu/Chicken/Chicken';
import Deserts from './components/Menu/Deserts/Deserts';
import Drinks from './components/Menu/Drinks/Drinks';
import Duner from './components/Menu/Duner/Duner';
import Falafel from './components/Menu/Falafel/Falafel';
import Sauces from './components/Menu/Sauces/Sauces';
import Pizza from './components/Menu/Pizza/Pizza';

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/burger' element={<Burger />} />
          <Route path='/chicken' element={<Chicken />} />
          <Route path='/deserts' element={<Deserts />} />
          <Route path='/drinks' element={<Drinks />} />
          <Route path='/duner' element={<Duner />} />
          <Route path='/falafel' element={<Falafel />} />
          <Route path='/sauces' element={<Sauces/>} />
          <Route path='/pizza' element={<Pizza/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
