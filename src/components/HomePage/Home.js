import styles from './Home.module.css'

const Home = () => {
    return (
        <>
        <section className={styles[`container`]}>
            <img src="/images/slide-picture-duner.jpg" alt="doner" />
            <div className={styles["content"]}>
                <h1 className={styles["title"]}>ДЮ НЕР</h1>
                <p className={styles["desc"]}>
                    Поръчай вкусен дюнер от голямото ни разнообразие с пилешко, телешко е панирано месо, в питка
                    или порция
                </p>
                <button className={styles["btn-order"]}>ПОРЪЧАЙ</button>
            </div>
        </section>
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
    <section className={styles["offers"]}>
        <div className={styles["offers-title"]}>
            <h3>ПРОМОЦИИ</h3>
        </div>
        <div className={styles["offers-pictures"]}>
            <div>
                <img className={styles["offers-img1"]} src="/images/master-combo.jpg" alt="" />
                <div className={styles["offers-desc"]}>
                    <p>МАСТЪР КОМБО</p>
                </div>
            </div>
            <div>
                <img className={styles["offers-img2"]} src="/images/pizza-ta-dranka.jpg" alt="" />
                <div className={styles["offers-desc"]}>
                    <p>ПИЦА, ТА ДРЪНКА</p>
                </div>
            </div>
            <div>
                <img className={styles["offers-img3"]} src="/images/teleshko-izkushenie.jpg" alt="" />
                <div className={styles["offers-desc"]}>
                    <p>ТЕЛЕШКО ИЗКУШЕНИЕ</p>
                </div>
            </div>
        </div>
    </section>
    </>
    );
}

export default Home;