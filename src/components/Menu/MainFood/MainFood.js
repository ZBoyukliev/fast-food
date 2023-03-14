import * as menuService from '../../../services/menuService';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Subnav from '../../Subnav/Subnav';
import Trolley from '../../Trolley/Trolley';
import styles from './MainFood.module.css';
import MainFoodItem from './MainFoodItem/MainFoodItem';

const MainFood = ({ src, type }) => {

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
                    <img src={src} alt="duner" />
                </section>
                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>{type}</h3>
                    </div>

                    <div className={styles['menu-sec']}>

                        {menu.map(d => <MainFoodItem key={d._id} {...d} />)}

                    </div>
                </section>
            </main>
        </>
    );
};

export default MainFood;