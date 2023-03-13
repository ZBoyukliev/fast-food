// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import * as menuService from '../../services/menuService';
// import styles from './Menu.module.css';
// import Subnav from './Subnav/Subnav';
// import Trolley from './Trolley/Trolley';

// const Menu = () => {

//     const location = useLocation();
//     const [menu, setMenu] = useState([]);
//     const category = location.pathname.slice(1);

//     useEffect(() => {
//         menuService.getByCategory(category)
//             .then(res => setMenu(res));
//     }, [category]);

//     return (
//         <>
//             <Subnav />
//             <main className={styles['main']}>
//                 <Trolley />

//                 <section className={styles['container']}>
//                     <img src="/images/slide-picture-duner1.jpg" alt="duner" />
//                 </section>

//                 <section className={styles['menu']}>

//                     <div className={styles['menu-title']}>
//                         <h3>ПРОМОЦИИ</h3>
//                     </div>

//                     {menu.map(m => (
//                         <div className={styles['menu-sec']}>

//                             {/* <div className={styles['menu-sec-product']}>
//                               <h3 className={styles['menu-sec-title']}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
//                               <img src='./images/TM_580x500.png' alt='meal' />
//                               <div className={styles['menu-price']}>
//                                   <span>5.</span>
//                                   <span>50</span>
//                                   <span>лв.</span>
//                                   <span>Вместо 23.40</span>
//                               </div>
//                               <button className={styles['btn-menu']}>
//                                   <i class="fa-solid fa-circle-info" />
//                                   ИЗБЕРИ МЕНЮ
//                               </button>
//                           </div> */}

//                             <div className={styles['menu-sec-product']}>
//                                 <h3 className={styles['menu-sec-title']}>{m.title}</h3>
//                                 <img src={m.imageUrl} alt='meal' />
//                                 <div className={styles['menu-price']}>
//                                     <span>{m.priceLv}</span>
//                                     <span>{m.priceSt}</span>
//                                     <span>лв.</span>
//                                 </div>
//                                 <div className={styles['div-btn']}>
//                                     <button className={styles['btn']}>МЕНЮ</button>
//                                     <button className={styles['btn']}>ДЕТАЍЛИ</button>
//                                     <button className={styles['btn']}>ДОБАВИ</button>
//                                 </div>
//                             </div>

//                         </div>
//                     ))}

//                 </section>
//             </main>
//         </>
//     );
// };

// export default Menu;