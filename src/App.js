import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SideOrders from './components/Menu/SideOrders/SideOrders';
import OffersPage from './components/OffersPage/OffersPage';
import FoodDetails from './components/Details/FoodDetails';
import MenuNavPage from './components/MenuNavPage/MenuNavPage';
import OffersPageItem from './components/OffersPageItem/OffersPageItem';
import Comments from './components/Comments/Comments';
import WhatsNew from './components/WhatsNew/WhatsNew';
import Search from './components/Header/Search';
import CreateOrder from './components/CreateOrder/CreateOrder';
import { Logout } from './components/Logout/Logout';
import {  RouteGuard } from './components/commons/RouteGuard';
import { LogoutGuard } from './components/commons/LogoutGuard';

function App() {


  return (
    <>
      <AuthProvider>
        <FoodProvider>
          <Header />
          <div className="App">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/menu' element={<MenuNavPage src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
              <Route path='/menu/:category' element={<SideOrders src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
              <Route path='/menu/burger' element={<SideOrders src={'/images/slide-picture-burger1.jpg'} type={'БУРГЕР'} />} />
              <Route path='/menu/pizza' element={<SideOrders src={'/images/slide-picture-pizza.jpg'} type={'ПИЦА'} />} />
              <Route path='/menu/chicken' element={<SideOrders src={'/images/slide-picture-chicken.jpg'} type={'ПИЛЕ'} />} />
              <Route path='/menu/falafel' element={<SideOrders src={'/images/falafel/falafelbg.jpg'} type={'ФАЛАФЕЛ'} />} />
              <Route path='/menu/souces' element={<SideOrders src={'/images/chips-and-dips-oct-22.jpg'} type={'ГАРНИТУРИ И СОСОВЕ'} />} />
              <Route path='/menu/drinks' element={<SideOrders src={'/images/drinks/coca-cola-fizzy-drinks1.jpg'} type={'НАПИТКИ'} />} />
              <Route path='/menu/deserts' element={<SideOrders src={'/images/deserts/bgmuffins1.jpg'} type={'ДЕСЕРТИ'} />} />
              <Route path='/menu/kids' element={<SideOrders src={'/images/kids/maxresdefault1.jpg'} type={'ДЕТСКО МЕНЮ'} />} />
              <Route path='/coments' element={<Comments />} />

              <Route element={<RouteGuard />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>

              <Route element={<LogoutGuard />}>
                <Route path='/logout' element={<Logout />} />
              </Route>

              <Route path='/offers' element={<OffersPage />} />
              <Route path='/news' element={<WhatsNew src={'/images/pizza/pizza-news.jpg'} />} />
              <Route path='/offers/:offerId' element={<OffersPageItem />} />
              <Route path='/menu/:category/:foodId' element={<FoodDetails />} />
              <Route path='/search' element={<Search />} />
              <Route path='/createorder' element={<CreateOrder />} />
            </Routes>
          </div>
          <Footer />
        </FoodProvider>
      </AuthProvider>
    </>
  );
}

export default App;
