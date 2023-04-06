import { AuthContext } from '../../context/AuthContext';
import { FoodContext } from '../../context/FoodContext';
import { SearchContext } from '../../context/SearchContext';

import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import styles from './Header.module.css';

const Header = () => {

    const { user } = useContext(AuthContext);
    const [search, setSearch] = useState({ search: '' });
    const { totalPrice } = useContext(FoodContext);
    const { onSearch } = useContext(SearchContext);

    const onChangeHandler = (e) => {
        setSearch(state => ({ ...state, [e.target.name]: e.target.value }));
    };


    const onSearchSubmit = (e) => {
        onSearch(e, search);
        setSearch({search: ''});
    };

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
                        <NavLink className={({ isActive }) => isActive ? styles['nav-active'] : ''} to="/coments">КОМЕНТАРИ И РЕВЮТА</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-active'] : ''} to="/news">КАКВО НОВО</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-active'] : ''} to="/astandarts">А!СТАНДАРТ</NavLink>
                    </li>
                    <li className={styles['nav-link']}>
                        <NavLink className={({ isActive }) => isActive ? styles['nav-active--'] : ''} to="/kids">ПИШИ НИ</NavLink>
                    </li>
                </ul>

                <div className={styles['phone-number']}>
                    <i className="fa-solid fa-phone"></i>
                    <span>0700044744</span>
                </div>
                <form onSubmit={onSearchSubmit}>
                    <input className={styles['search']}
                        type="text"
                        name="search"
                        value={search.search}
                        onChange={onChangeHandler}
                        placeholder="Търси" />
                </form>
                <Link className={styles['order']} to="/createorder">ПОРЪЧАЙ {totalPrice > 0 ? totalPrice.toFixed(2) + 'лв.' : ''}</Link>
            </nav>
        </header>
    );
};

export default Header;