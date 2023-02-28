import styles from './Thumbs.module.css';

const Thumbs = () => {
    return (
        <section className={styles["thumbs"]}>
            <ul>
                <li>
                    <img src="/images/duner.png" alt="" />
                    <h5>ДЮНЕР</h5>
                </li>
                <li>
                    <img src="/images/burger.png" alt="" />
                    <h5>БУРГЕР</h5>
                </li><li>
                    <img src="/images/pizza.png" alt="" />
                    <h5>ПИЦА</h5>
                </li><li>
                    <img src="/images/chicken.png" alt="" />
                    <h5>ПИЛЕ</h5>
                </li><li>
                    <img src="/images/falafel.png" alt="" />
                    <h5>ФАЛАФЕЛ</h5>
                </li><li>
                    <img src="/images/garnituri.png" alt="" />
                    <h5>ГАРНИТУРИ И СОСОВЕ</h5>
                </li><li>
                    <img src="/images/ayran.png" alt="" />
                    <h5>НАПИТКИ</h5>
                </li><li>
                    <img src="/images/deserts.png" alt="" />
                    <h5>ДЕСЕРТИ</h5>
                </li><li>
                    <img src="/images/kids-meal.png" alt="" />
                    <h5>ДЕТСКО МЕНЮ</h5>
                </li>
            </ul>
        </section>
    );
};

export default Thumbs;