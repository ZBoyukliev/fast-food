import { useEffect, useState } from 'react';
import * as menuService from '../../../services/menuService';

import styles from './KidsMenu.module.css';
import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';

const KidsMenu = () => {

    const [kidsMenu, setKidsMenu] = useState([]);

    useEffect(() => {
        menuService.getByCategory('kids')
            .then(res => setKidsMenu(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    <img src="/images/falafel.png" alt="kids" />
                </section>

                <section className={styles['menu']}>

                    <div className={styles['menu-title']}>
                        <h3>ДЕТСКО МЕНЮ</h3>
                    </div>

                    <div className={styles['menu-sec']}>

                        {kidsMenu.map( k => (
                              <div key={k._id} className={styles['menu-sec-product']}>
                              <h3 className={styles['menu-sec-title']}>{k.title}</h3>
                              <img src={k.imageUrl} alt='meal' />
                              <div className={styles['menu-price']}>
                                  <span>{k.priceLv}</span>
                                  <span>{k.priceSt}</span>
                                  <span>лв.</span>
                              </div>
                              <div className={styles['div-btn']}>
                                  {/* <button className={styles['btn']}>МЕНЮ</button> */}
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

export default KidsMenu;