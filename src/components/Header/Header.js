import styles from './Header.module.css';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Header = () => {

    const { user } = useContext(AuthContext);


    return (
        <header className={styles['header']}>
            <div className={styles['working-time-login']}>
                <Link to='/'> <img className={styles['logo']} src="/images/logo.png" alt="logo" /></Link>
                <p className={styles['working-time']}>РАБОТНО ВРЕМЕ 10:55 - 00:55</p>
                <div className={styles['login']}>
                    {user.email && <span>Wellcome {user.email} </span>}

                    {user.email ?
                        <Link to="/logout">Изход</Link>
                        :
                        <>
                            <Link to="/login">Вход</Link>
                            <div className={styles['divider']}></div>
                            <Link to="/register">Регистрация</Link>
                        </>
                    }

                </div>
            </div>
            <nav>
                <ul className={styles['navigation']} >
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-active'] : ''} to='/menu'>МЕНЮ</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-active'] : ''} to="/offers">ПРОМОЦИИ</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-acctive'] : ''} to="/coments">КОМЕНТАРИ И РЕВЮТА</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-acctive'] : ''} href="/whatsnew">КАКВО НОВО</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-acctive'] : ''} href="/kids">ЕЛА ПРИ НАС</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-acctive'] : ''} href="/kids">ПИШИ НИ</NavLink>
                    </li>
                </ul>

                <div className={styles['phone-number']}>
                    <i className="fa-solid fa-phone"></i>
                    <span>0700044744</span>
                </div>

                <input className={styles['search']} type="text" placeholder="Търси" />
                <a className={styles['order']} href="/#">ПОРЪЧАЙ</a>
            </nav>
        </header>
    );
};

export default Header;