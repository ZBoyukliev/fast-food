import * as menuService from '../../../services/menuService';
import { useEffect, useState } from 'react';

import Subnav from '../../Subnav/Subnav';
import Trolley from '../../Trolley/Trolley';
import styles from './SideOrders.module.css';
import { useLocation } from 'react-router-dom';


const Drinks = ({ src, type }) => {

    const location = useLocation();
    const [menu, setMenu] = useState([]);
    const category = location.pathname.slice(1);

    useEffect(() => {
        menuService.getByCategory(category)
            .then(res => setMenu(res));
    }, [category]);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>

                <Trolley />

                <section className={styles['container']}>
                    <img src={src} alt="drinks" />
                </section>

                <section className={styles['menu']}>

                    <div className={styles['menu-title']}>
                        <h3>{type}</h3>
                    </div>

                    <div className={styles['menu-sec']}>

                        {menu.map(d => (
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