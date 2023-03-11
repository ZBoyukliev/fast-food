import * as menuService from '../../../services/menuService';
import { useEffect, useState } from 'react';

import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Drinks.module.css';


const Drinks = () => {

    const [drink, setDrink] = useState([]);

    useEffect(() => {
        menuService.getByCategory('drinks')
            .then(res => setDrink(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>

                <Trolley />

                <section className={styles['container']}>
                    <img src="/images/ayran.png" alt="drinks" />
                </section>

                <section className={styles['menu']}>

                    <div className={styles['menu-title']}>
                        <h3>НАПИТКИ</h3>
                    </div>

                    <div className={styles['menu-sec']}>

                        {drink.map( d => (
                               <div key={d._id} className={styles['menu-sec-product']}>
                               <h3 className={styles['menu-sec-title']}>{d.title}</h3>
                               <img src={d.imageUrl} alt='meal' />
                               <div className={styles['menu-price']}>
                                   <span>{d.priceLv}</span>
                                   <span>{d.priceSt}</span>
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

export default Drinks;