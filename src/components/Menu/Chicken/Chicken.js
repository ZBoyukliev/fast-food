import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Chicken.module.css';
import { useEffect, useState } from 'react';
import * as menuService from '../../../services/menuService';

const Chicken = () => {

    const [chicken, setChicken] = useState([]);

    useEffect(() => {
        menuService.getByCategory('chicken')
            .then(res => setChicken(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    <img src="/images/slide-picture-chicken1.jpg" alt="chiken" />
                </section>
                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>ПИЛЕ</h3>
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

                        {chicken.map( c => (
                              <div className={styles['menu-sec-product']}>
                              <h3 className={styles['menu-sec-title']}>{c.title}</h3>
                              <img src={c.imageUrl} alt='meal' />
                              <div className={styles['menu-price']}>
                                  <span>{c.priceLv}</span>
                                  <span>{c.priceSt}</span>
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

export default Chicken;