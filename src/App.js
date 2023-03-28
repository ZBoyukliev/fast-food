import { Routes, Route, useNavigate } from 'react-router-dom';
import * as menuService from './services/menuService';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SideOrders from './components/Menu/SideOrders/SideOrders';
import OffersPage from './components/OffersPage/OffersPage';
import { AuthProvider } from './components/context/AuthContext';
import { Logout } from './components/Logout/Logout';
import FoodDetails from './components/Details/FoodDetails';
import MenuNavPage from './components/MenuNavPage/MenuNavPage';
import OffersPageItem from './components/OffersPageItem/OffersPageItem';
import Comments from './components/Comments/Comments';
import WhatsNew from './components/WhatsNew/WhatsNew';
import { useState } from 'react';
import Search from './components/Header/Search';
import { FoodContext } from './components/context/FoodContext';

function App() {

  const [searchFood, setSearchFood] = useState([]);
  const navigate = useNavigate();

  const onSearch = async (e, search) => {
    e.preventDefault();

    const foodName = search.search;
    const result = await menuService.searchFood(foodName);

    setSearchFood(result);
    navigate('/search');
  };


  return (
    <>
      <AuthProvider>
        <FoodContext.Provider value={{ onSearch, searchFood }}>
          <Header />
          <div className="App">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='/menu' element={<MenuNavPage src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
              <Route path='/menu/doner' element={<SideOrders src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
              <Route path='/menu/burger' element={<SideOrders src={'/images/slide-picture-burger1.jpg'} type={'БУРГЕР'} />} />
              <Route path='/menu/pizza' element={<SideOrders src={'/images/slide-picture-pizza.jpg'} type={'ПИЦА'} />} />
              <Route path='/menu/chicken' element={<SideOrders src={'/images/slide-picture-chicken.jpg'} type={'ПИЛЕ'} />} />
              <Route path='/menu/falafel' element={<SideOrders src={'/images/falafel/falafelbg.jpg'} type={'ФАЛАФЕЛ'} />} />
              <Route path='/menu/souces' element={<SideOrders src={'/images/chips-and-dips-oct-22.jpg'} type={'ГАРНИТУРИ И СОСОВЕ'} />} />
              <Route path='/menu/drinks' element={<SideOrders src={'/images/drinks/coca-cola-fizzy-drinks1.jpg'} type={'НАПИТКИ'} />} />
              <Route path='/menu/deserts' element={<SideOrders src={'/images/deserts/bgmuffins1.jpg'} type={'ДЕСЕРТИ'} />} />
              <Route path='/menu/kids' element={<SideOrders src={'/images/kids/maxresdefault1.jpg'} type={'ДЕТСКО МЕНЮ'} />} />
              <Route path='/offers' element={<OffersPage />} />
              <Route path='/news' element={<WhatsNew src={'/images/pizza/pizza-news.jpg'} />} />
              <Route path='/offers/:offerId' element={<OffersPageItem />} />
              <Route path='/:category/:foodId' element={<FoodDetails />} />
              <Route path='/coments' element={<Comments />} />
              <Route path='/search' element={<Search />} />
            </Routes>
          </div>
          <Footer />
        </FoodContext.Provider>
      </AuthProvider>
    </>
  );
}

export default App;
