import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Deserts from './components/Menu/Deserts/Deserts';
import Drinks from './components/Menu/Drinks/Drinks';
import Duner from './components/Duner/Duner';
import Sauces from './components/Menu/Sauces/Sauces';
import KidsMenu from './components/Menu/KidsMenu/KidsMenu';
import OffersPage from './components/OffersPage/OffersPage';

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/doner' element={<Duner src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'}/>} />
          <Route path='/burger' element={<Duner src={'/images/slide-picture-burger1.jpg'} type={'БУРГЕР'}/>} />
          <Route path='/pizza' element={<Duner src={'/images/slide-picture-pizza.jpg'} type={'ПИЦА'}/>} />
          <Route path='/chicken' element={<Duner src={'/images/slide-picture-chicken.jpg'} type={'ПИЛЕ'}/>} />
          <Route path='/falafel' element={<Duner src={'/images/falafel/falafelbg.jpg'} type={'ФАЛАФЕЛ'}/>} />
          <Route path='/deserts' element={<Deserts />} />
          <Route path='/drinks' element={<Drinks />} />
          <Route path='/sauces' element={<Sauces/>} />
          <Route path='/kids' element={<KidsMenu />} />
          <Route path='/offers' element={<OffersPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
