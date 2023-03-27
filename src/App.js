import { Routes, Route } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SideOrders from './components/Menu/SideOrders/SideOrders';
import MainFood from './components/Menu/MainFood/MainFood';
import OffersPage from './components/OffersPage/OffersPage';
import { AuthProvider } from './components/context/AuthContext';
import { Logout } from './components/Logout/Logout';
import FoodDetails from './components/Details/FoodDetails';
import MenuNavPage from './components/MenuNavPage/MenuNavPage';
import OffersPageItem from './components/OffersPageItem/OffersPageItem';
import Comments from './components/Comments/Comments';
import WhatsNew from './components/WhatsNew/WhatsNew';

function App() {

//   const contextValues = {
//     userId: auth._id,
//     token: auth.accessToken,
//     userEmail: auth.email,
//     isAuthenticated: !!auth.accessToken,
// };

  return (
    <>
      <AuthProvider>
        <Header />
        <div className="App">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/menu' element={<MenuNavPage src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
            <Route path='/menu/doner' element={<MainFood src={'/images/slide-picture-duner1.jpg'} type={'ДЮНЕР'} />} />
            <Route path='/menu/burger' element={<MainFood src={'/images/slide-picture-burger1.jpg'} type={'БУРГЕР'} />} />
            <Route path='/menu/pizza' element={<MainFood src={'/images/slide-picture-pizza.jpg'} type={'ПИЦА'} />} />
            <Route path='/menu/chicken' element={<MainFood src={'/images/slide-picture-chicken.jpg'} type={'ПИЛЕ'} />} />
            <Route path='/menu/falafel' element={<MainFood src={'/images/falafel/falafelbg.jpg'} type={'ФАЛАФЕЛ'} />} />
            <Route path='/menu/souces' element={<SideOrders src={'/images/chips-and-dips-oct-22.jpg'} type={'ГАРНИТУРИ И СОСОВЕ'} />} />
            <Route path='/menu/drinks' element={<SideOrders src={'/images/drinks/coca-cola-fizzy-drinks1.jpg'} type={'НАПИТКИ'} />} />
            <Route path='/menu/deserts' element={<SideOrders src={'/images/deserts/bgmuffins1.jpg'} type={'ДЕСЕРТИ'} />} />
            <Route path='/menu/kids' element={<SideOrders src={'/images/kids/maxresdefault1.jpg'} type={'ДЕТСКО МЕНЮ'} />} />
            <Route path='/offers' element={<OffersPage />} />
            <Route path='/news' element={<WhatsNew src={'/images/falafel/falafelbg.jpg'}/>} />
            <Route path='/offers/:offerId' element={<OffersPageItem />} />
            <Route path='/:category/:foodId' element={<FoodDetails />} />
            <Route path='/coments' element={<Comments />} />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
