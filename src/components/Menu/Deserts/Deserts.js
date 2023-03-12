import { useEffect, useState } from 'react';
import * as menuService from '../../../services/menuService';

import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Deserts.module.css';

const Deserts = () => {

    const [desert, setDesert] = useState([]);

    useEffect(() => {
        menuService.getByCategory('deserts')
            .then(res => setDesert(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />

                <section className={styles['container']}>
                    <img src="/images/deserts.png" alt="deserts" />
                </section>

                <section className={styles['menu']}>

                    <div className={styles['menu-title']}>
                        <h3>ДЕСЕРТИ</h3>
                    </div>

                    <div className={styles['menu-sec']}>

                        {desert.map(d => (
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

export default Deserts;