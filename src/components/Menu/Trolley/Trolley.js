import styles from './Trolley.module.css';

const Trolley = () => {
    return (
        <div className={styles[`outer`]}>
            <div className={styles[`trolley`]}>

                <header className={styles[`trolley-head`]}>
                    <h3 className={styles[`trolley-head-tittle`]}><i class="fa-solid fa-cart-shopping"></i>КОЛИЧКА</h3>
                </header>

                <div className={styles[`items`]}>
                    <ul className={styles[`items-aded`]}>
                        <div className={styles[`items-aded-inner`]}>
                            <li className={styles[`items-aded-li`]}>
                                В момента нямате добавени артикули в количката
                            </li>
                        </div>
                    </ul>
                </div>


            </div>
        </div>
    );
};

export default Trolley;