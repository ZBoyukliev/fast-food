import * as menuService from '../../../services/menuService';
import { useEffect, useState } from 'react';

import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Pizza.module.css';

const Pizza = () => {

    const [pizza, setPizza] = useState([]);

    useEffect(() => {
        menuService.getByCategory('pizza')
            .then(res => setPizza(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    <img src="/images/slide-picture-pizza.jpg" alt="pizza" />
                </section>
                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>ПИЦА</h3>
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

                        {pizza.map(p => (
                                  <div className={styles['menu-sec-product']}>
                                  <h3 className={styles['menu-sec-title']}>{p.title}</h3>
                                  <img src={p.imageUrl} alt='meal' />
                                  <div className={styles['menu-price']}>
                                      <span>{p.priceLv}</span>
                                      <span>{p.priceSt}</span>
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

export default Pizza;