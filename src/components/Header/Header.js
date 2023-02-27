import styles from './Header.module.css'

const Header = () => {
    return(
        <header className={styles["header"]}>
        <div className={styles["working-time-login"]}>
            <img className={styles["logo"]} src="/images/logo.png" alt="logo" />
            <p className={styles["working-time"]}>РАБОТНО ВРЕМЕ 10:55 - 00:55</p>
            <div className={styles["login"]}>
                <a href="/login">Вход</a>
                <div className={styles["divider"]}></div>
                <a href="/register">Регистрация</a>
            </div>
        </div>
        <nav>
            <ul className={styles["navigation"]} role="list">
                <li className={styles["nav-link"]}>
                    <a href="/#">МЕНЮ</a>
                </li>
                <li className={styles["nav-link"]}>
                    <a href="/#">ПРОМОЦИИ</a>
                </li>
                <li className={styles["nav-link"]}>
                    <a href="/#">А!СТАНДАРТ</a>
                </li>
                <li className={styles["nav-link"]}>
                    <a href="/#">КАКВО НОВО</a>
                </li>
                <li className={styles["nav-link"]}>
                    <a href="/#">ЕЛА ПРИ НАС</a>
                </li>
                <li className={styles["nav-link"]}>
                    <a href="/#">ПИШИ НИ</a>
                </li>
                <li className={styles["nav-link"]}>
                    <a href="/#">B2B</a>
                </li>
            </ul>

            <div className={styles["phone-number"]}>
                <i className="fa-solid fa-phone"></i>
                <span>0700044744</span>
            </div>

            <input className={styles["search"]} type="text" placeholder="Търси" />
            <a className={styles["order"]} href="/#">ПОРЪЧАЙ</a>
        </nav>
    </header>
    );
};

export default Header;