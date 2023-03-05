import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';
import styles from './Falafel.module.css';


const Falafel = () => {
    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    <img src="/images/falafel.png" alt="falafel" />
                </section>
                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>ФАЛАФЕЛ</h3>
                    </div>
                    <div className={styles['menu-sec']}>
                        <div className={styles['menu-sec-product']}>
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
                        </div>

                        <div className={styles['menu-sec-product']}>
                            <h3 className={styles['menu-sec-title']}>ROLLER</h3>
                            <img src='./images/roller.png' alt='meal' />
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
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Falafel;