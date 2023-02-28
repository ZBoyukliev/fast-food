import styles from './Header.module.css'
import { Link } from 'react-router-dom';

const Header = () => {
    return(
        <header className={styles["header"]}>
        <div className={styles["working-time-login"]}>
           <Link to='/'> <img className={styles["logo"]} src="/images/logo.png" alt="logo" /></Link>
            <p className={styles["working-time"]}>РАБОТНО ВРЕМЕ 10:55 - 00:55</p>
            <div className={styles["login"]}>
                <Link to="/login">Вход</Link>
                <div className={styles["divider"]}></div>
                <Link to="/register">Регистрация</Link>
            </div>
        </div>
        <nav>
            <ul className={styles["navigation"]} role="list">
                <li className={styles["nav-link"]}>
                    <Link to="/menu">МЕНЮ</Link>
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