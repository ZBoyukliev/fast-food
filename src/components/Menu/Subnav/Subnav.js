import styles from './Subnav.module.css';

const Subnav = () => {
    return (
        <div className={styles[`sub`]}>
            <div className={styles[`sub-shell`]}>
                <ul className={styles[`sub-shell-ul`]}>
                    <li>Дюнер</li>
                    <li>Бургер</li>
                    <li>Пица</li>
                    <li>Пиле</li>
                    <li>Фалафел</li>
                    <li>Гарнитури и сосове</li>
                    <li>Напитки</li>
                    <li>Десерти</li>
                    <li>Детско меню</li>
                </ul>
            </div>
        </div>
    );
};

export default Subnav;