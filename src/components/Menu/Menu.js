import styles from './Menu.module.css';
import Subnav from './Subnav/Subnav';

const Menu = () => {
    return (
        <>
            <Subnav />
            <section className={styles[`container`]}>
                <img src="/images/slide-picture-duner.jpg" alt="doner" />
            </section>
            <section className={styles[`menu`]}>
                <div className={styles["menu-title"]}>
                    <h3>ПРОМОЦИИ</h3>
                </div>
                <div className={styles[`menu-sec`]}>

                    <div className={styles[`menu-sec-product`]}>
                        <h3 className={styles[`menu-sec-title`]}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                        <img src='./images/TM_580x500.png' alt='meal' />
                        <button className={styles[`btn-menu`]}><i class="fa-solid fa-circle-info"></i>ИЗБЕРИ МЕНЮ</button>
                    </div>

                    <div className={styles[`menu-sec-product`]}>
                        <h3 className={styles[`menu-sec-title`]}>ROLLER</h3>
                        <img src='./images/roller.png' alt='meal' />
                        <div className={styles[`div-btn`]}>
                            <button className={styles[`btn`]}>МЕНЮ</button>
                            <button className={styles[`btn`]}>ДЕТАЍЛИ</button>
                            <button className={styles[`btn`]}>ДОБАВИ</button>
                        </div>
                    </div>

                    <div className={styles[`menu-sec-product`]}>
                        <h3 className={styles[`menu-sec-title`]}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                        <img src='./images/roller.png' alt='meal' />
                        <div className={styles[`div-btn`]}>
                            <button className={styles[`btn`]}>МЕНЮ</button>
                            <button className={styles[`btn`]}>ДЕТАЍЛИ</button>
                            <button className={styles[`btn`]}>ДОБАВИ</button>
                        </div>
                    </div>

                    <div className={styles[`menu-sec-product`]}>
                        <h3 className={styles[`menu-sec-title`]}>ТЕЛЕШКО ИЗКУШЕНИЕ</h3>
                        <img src='./images/roller.png' alt='meal' />
                        <div className={styles[`div-btn`]}>
                            <button className={styles[`btn`]}>МЕНЮ</button>
                            <button className={styles[`btn`]}>ДЕТАЍЛИ</button>
                            <button className={styles[`btn`]}>ДОБАВИ</button>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
};

export default Menu;