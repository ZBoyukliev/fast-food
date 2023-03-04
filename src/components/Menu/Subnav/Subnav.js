import { Link } from 'react-router-dom';
import styles from './Subnav.module.css';

const Subnav = () => {
    return (
        <div className={styles['sub']}>
            <div className={styles['sub-shell']}>
                <ul className={styles['sub-shell-ul']}>
                    <Link to='/duner'><li>Дюнер</li></Link>
                    <Link to='/burger'><li>Бургер</li></Link>
                    <Link to='/pizza'><li>Пица</li></Link>
                    <Link to='/chicken'><li>Пиле</li></Link>
                    <Link to='/falafel'><li>Фалафел</li></Link>
                    <Link to='/sauces'><li>Гарнитури и сосове</li></Link>
                    <Link to='/drinks'><li>Напитки</li></Link>
                    <Link to='/deserts'><li>Десерти</li></Link>
                    <Link to='/kids'> <li>Детско меню</li></Link>
                </ul>
            </div>
        </div>
    );
};

export default Subnav;