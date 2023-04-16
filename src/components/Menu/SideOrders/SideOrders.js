import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import * as menuService from '../../../services/menuService';

import Subnav from '../../Subnav/Subnav';
import Trolley from '../../Trolley/Trolley';
import styles from './SideOrders.module.css';
import SideOrderItem from './SideOrderItem/SideOrderItem';
import Spinner from '../../Spinner/Spinner';
import ArrowToTop from '../../ArrowToTop/ArrowToTop';

const SideOrders = ({ src, type }) => {

    const [menu, setMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const location = useLocation();
    
    const category = location.pathname.slice(6);

    useEffect(() => {
        setIsLoading(true);
        menuService.getByCategory(category)
            .then(res => {
                setMenu(res);
                setIsLoading(false);
            })
            .catch((error) => {
               setIsLoading(false);
               setMenu([]);
            });
    }, [category]);

    return (
        <>
            {isLoading ? <Spinner /> :
                <>
                
                    <Subnav />
                    {menu.length > 0 ?  
                    <main className={styles['main']}>
                        <Trolley />
                        <ArrowToTop />
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

                    </main>  :
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
                             <h2 className={styles['menu-sec-title']}>В МОМЕНТА НЯМА НАЛИЧНИ ПРОДУКТИ.</h2>
                          </div>
                      </section>

                  </main>
                    }
                </>
            }
        </>
    );
};

export default SideOrders;