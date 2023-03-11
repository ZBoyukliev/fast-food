import * as menuService from '../../../services/menuService';
import { useEffect, useState } from 'react';

import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Burger.module.css';


const Burger = () => {

    const [burger, setBurger] = useState([]);

    useEffect(() => {
        menuService.getByCategory('burger')
            .then(res => setBurger(res));
    }, []);


    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    <img src="/images/slide-picture-burger1.jpg" alt="burger" />
                </section>
                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>БУРГЕР</h3>
                    </div>
                    <div className={styles['menu-sec']}>

                        {/* <div className={styles['menu-sec-product']}>
                            <h3 className={styles['menu-sec-title']}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                            <img src='./images/TM_580x500.png' alt='meal' />
                            <div className={styles['menu-price']}>
                                <span>5.</span>
                                <span>50</span>
                                <span>лв.</span>
                                <span>Вместо 23.40</span>
                            </div>
                            <button className={styles['btn-menu']}>
                                <i class="fa-solid fa-circle-info" />
                                ИЗБЕРИ МЕНЮ
                            </button>
                        </div> */}

                        {burger.map(b => (
                               <div className={styles['menu-sec-product']}>
                               <h3 className={styles['menu-sec-title']}>{b.title}</h3>
                               <img src={b.imageUrl} alt='meal' />
                               <div className={styles['menu-price']}>
                                   <span>{b.priceLv}</span>
                                   <span>{b.priceSt}</span>
                                   <span>лв.</span>
                               </div>
                               <div className={styles['div-btn']}>
                                   <button className={styles['btn']}>МЕНЮ</button>
                                   <button className={styles['btn']}>ДЕТАЍЛИ</button>
                                   <button className={styles['btn']}>ДОБАВИ</button>
                               </div>
                           </div>
                        ))}

                    </div>
                </section>
            </main>
        </>
    );
};

export default Burger;