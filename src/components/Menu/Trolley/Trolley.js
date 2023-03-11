import styles from './Trolley.module.css';
import { Link } from 'react-router-dom';

const Trolley = () => {
    return (
        <div className={styles['outer']}>
            <div className={styles['trolley']}>

                <header className={styles['trolley-head']}>
                    <h3 className={styles['trolley-head-tittle']}><i className="fa-solid fa-cart-shopping"></i>КОЛИЧКА</h3>
                </header>

                <div className={styles['items']}>
                    <ul className={styles['items-aded']}>
                        <div className={styles['items-aded-inner']}>
                            <li className={styles['items-aded-li']}>
                                В момента нямате добавени артикули в количката
                            </li>
                            {/* <li className={styles[`items-aded-li`]}>
                                В момента нямате добавени артикули в количката
                            </li> */}
                            {/* <li className={styles[`items-aded-li`]}>
                                В момента нямате добавени артикули в количката
                            </li> */}
                            {/* <li className={styles[`items-aded-li`]}>
                                В момента нямате добавени артикули в количката
                            </li> */}
                        </div>
                    </ul>
                    <div className={styles['calc-sum']}>
                    <small className={styles['small']}>МЕЖДИННА СУМА:</small>
                    <h3 className={styles['calc-sum-head']}>0лв.</h3>
                </div>
                </div>

                <footer className={styles['trolley-footer']}>
                    <Link className={styles['trolley-link-btn']}>ПОРЪЧАЙ</Link>
                </footer>

            </div>
        </div>
    );
};

export default Trolley;