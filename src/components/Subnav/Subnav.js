import { NavLink } from 'react-router-dom';
import styles from './Subnav.module.css';

const Subnav = () => {
    return (
        <div className={styles['sub']}>
            <div className={styles['sub-shell']}>
                <ul className={styles['sub-shell-ul']}>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''} to='/doner'><li>Дюнер</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/burger'><li>Бургер</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/pizza'><li>Пица</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/chicken'><li>Пиле</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/falafel'><li>Фалафел</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/souces'><li>Гарнитури и сосове</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/drinks'><li>Напитки</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/deserts'><li>Десерти</li></NavLink>
                    <NavLink className={({isActive}) => isActive ? styles['nav-active'] : ''}  to='/kids'> <li>Детско меню</li></NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Subnav;