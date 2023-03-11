import * as menuService from '../../../services/menuService';
import { useEffect, useState } from 'react';

import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Sauces.module.css';


const Sauces = () => {

    const [souces, setSouces] = useState([]);

    useEffect(() => {
        menuService.getByCategory('souces')
            .then(res => setSouces(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />

                <section className={styles['container']}>
                    <img src="/images/falafel.png" alt="sauces" />
                </section>

                <section className={styles['menu']}>

                    <div className={styles['menu-title']}>
                        <h3>ГАРНИТУРИ И СОСОВЕ</h3>
                    </div>

                    <div className={styles['menu-sec']}>

                        {souces.map(s => (
                            <div className={styles['menu-sec-product']}>
                                <h3 className={styles['menu-sec-title']}>{s.title}</h3>
                                <img src={s.imageUrl} alt='meal' />
                                <div className={styles['menu-price']}>
                                    <span>{s.priceLv}</span>
                                    <span>{s.priceSt}</span>
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

export default Sauces;
