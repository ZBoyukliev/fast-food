import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import * as menuService from '../../../services/menuService';
import Subnav from '../../Subnav/Subnav';
import Trolley from '../../Trolley/Trolley';
import styles from './SideOrders.module.css';
import SideOrderItem from './SideOrderItem/SideOrderItem';
import Spinner from '../../Spinner/Spinner';

const SideOrders = ({ src, type }) => {

    const location = useLocation();
    const [menu, setMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const category = location.pathname.slice(6);

    useEffect(() => {
        setIsLoading(true);
        menuService.getByCategory(category)
            .then(res => {
                setMenu(res);
                setIsLoading(false);
            });
    }, [category]);

    return (
        <>
            {isLoading ? <Spinner /> :
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

                                {menu.map(d => <SideOrderItem key={d._id} food={d} />)}

                            </div>
                        </section>

                    </main>
                </>
            }
        </>
    );
};

export default SideOrders;