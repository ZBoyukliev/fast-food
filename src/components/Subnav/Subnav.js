import { NavLink } from 'react-router-dom';
import styles from './Subnav.module.css';

const Subnav = () => {
    return (
        <div className={styles['sub']}>
            <div className={styles['sub-shell']}>
                <ul className={styles['sub-shell-ul']}>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''} to='/menu/doner'><li>Дюнер</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/burger'><li>Бургер</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/pizza'><li>Пица</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/chicken'><li>Пиле</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/falafel'><li>Фалафел</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/souces'><li>Гарнитури и сосове</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/drinks'><li>Напитки</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/deserts'><li>Десерти</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/menu/kids'> <li>Детско меню</li></NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Subnav;
