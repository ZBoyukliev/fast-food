import { Routes, Route } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SideOrders from './components/Menu/SideOrders/SideOrders';
import MainFood from './components/Menu/MainFood/MainFood';
import OffersPage from './components/OffersPage/OffersPage';
import { AuthContext } from './components/context/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Logout } from './components/Logout/Logout';

function App() {

  const [auth, setAuth] = useLocalStorage('auth', {});

  const userLogin = (authData) => {
    setAuth(authData);
  };

  const userLogout = () => {
    setAuth({});
  };

  return (
    <>
    <AuthContext.Provider value={{user:auth, userLogin, userLogout}}> 
      <Header />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/doner' element={<MainFood src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
          <Route path='/burger' element={<MainFood src={'/images/slide-picture-burger1.jpg'} type={'БУРГЕР'} />} />
          <Route path='/pizza' element={<MainFood src={'/images/slide-picture-pizza.jpg'} type={'ПИЦА'} />} />
          <Route path='/chicken' element={<MainFood src={'/images/slide-picture-chicken.jpg'} type={'ПИЛЕ'} />} />
          <Route path='/falafel' element={<MainFood src={'/images/falafel/falafelbg.jpg'} type={'ФАЛАФЕЛ'} />} />
          <Route path='/souces' element={<SideOrders src={'/images/chips-and-dips-oct-22.jpg'} type={'ГАРНИТУРИ И СОСОВЕ'} />} />
          <Route path='/drinks' element={<SideOrders src={'/images/drinks/coca-cola-fizzy-drinks1.jpg'} type={'НАПИТКИ'} />} />
          <Route path='/deserts' element={<SideOrders src={'/images/deserts/bgmuffins1.jpg'} type={'ДЕСЕРТИ'} />} />
          <Route path='/kids' element={<SideOrders src={'/images/kids/maxresdefault1.jpg'} type={'ДЕТСКО МЕНЮ'} />} />
          <Route path='/offers' element={<OffersPage />} />
        </Routes>
      </div>
      <Footer />
      </AuthContext.Provider>
    </>
  );
}

export default App;
