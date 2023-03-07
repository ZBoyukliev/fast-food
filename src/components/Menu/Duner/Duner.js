import { useEffect, useState } from 'react';
import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Duner.module.css';
import * as menuService from '../../../services/menuService';

const Duner = () => {

    const [duner, setDuner] = useState([]);

    useEffect(() => {
        menuService.getByCategory('doner')
            .then(res => setDuner(res));
    }, []);

    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    <img src="/images/slide-picture-duner1.jpg" alt="duner" />
                </section>
                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>ДЮНЕР</h3>
                    </div>
                    <div className={styles['menu-sec']}>

                        {duner.map( d => (
                                <div className={styles['menu-sec-product']}>
                                <h3 className={styles['menu-sec-title']}>{d.title}</h3>
                                <img src='./images/roller.png' alt='meal' />
                                <div className={styles['menu-price']}>
                                    <span>{d.priceLv}</span>
                                    <span>{d.priceSt}</span>
                                    <span>лв.</span>
                                </div>
                                <div className={styles['div-btn']}>
                                    <button className={styles['btn']}>МЕНЮ</button>
                                    <button className={styles['btn']}>ДЕТАЍЛИ</button>
                                    <button className={styles['btn']}>ДОБАВИ</button>
                                </div>
                            </div>
                        ))}

                        {/* <div className={styles['menu-sec-product']}>
                            <h3 className={styles['menu-sec-title']}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                            <img src='./images/2_Composite_za_obrabotka.png' alt='meal' />
                            <div className={styles['menu-price']}>
                                <span>5.</span>
                                <span>50</span>
                                <span>лв.</span>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']}>ДЕТАЍЛИ</button>
                                <button className={styles['btn']}>ДОБАВИ</button>
                            </div>
                        </div>

                        <div className={styles['menu-sec-product']}>
                            <h3 className={styles['menu-sec-title']}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                            <img src='./images/2_Composite_za_obrabotka.png' alt='meal' />
                            <div className={styles['menu-new-offer']}>
                                <span>НОВО !</span>
                            </div>
                            <div className={styles['menu-price']}>
                                <span>5.</span>
                                <span>50</span>
                                <span>лв.</span>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']}>ДЕТАЍЛИ</button>
                                <button className={styles['btn']}>ДОБАВИ</button>
                            </div>
                        </div>

                        <div className={styles['menu-sec-product']}>
                            <h3 className={styles['menu-sec-title']}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                            <img src='./images/2_Composite_za_obrabotka.png' alt='meal' />
                            <div className={styles['menu-price']}>
                                <span>5.</span>
                                <span>50</span>
                                <span>лв.</span>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']}>ДЕТАЍЛИ</button>
                                <button className={styles['btn']}>ДОБАВИ</button>
                            </div>
                        </div> */}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Duner;