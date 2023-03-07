import styles from './Thumbs.module.css';
import { Link } from 'react-router-dom';

const Thumbs = () => {
    return (
        <section className={styles['thumbs']}>
            <ul>
                <li>
                    <Link to='/duner'>
                        <img src="/images/duner.png" alt="duner" />
                        <h5>ДЮНЕР</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/burger'>
                        <img src="/images/burger.png" alt="burger" />
                        <h5>БУРГЕР</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/pizza'>
                        <img src="/images/pizza.png" alt="pizza" />
                        <h5>ПИЦА</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/chicken'>
                        <img src="/images/chicken.png" alt="chicken" />
                        <h5>ПИЛЕ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/falafel'>
                        <img src="/images/falafel.png" alt="falafel" />
                        <h5>ФАЛАФЕЛ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/sauces'>
                        <img src="/images/garnituri.png" alt="garnituri" />
                        <h5>ГАРНИТУРИ И СОСОВЕ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/drinks'>
                        <img src="/images/ayran.png" alt="ayran" />
                        <h5>НАПИТКИ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/deserts'>
                        <img src="/images/deserts.png" alt="deserts" />
                        <h5>ДЕСЕРТИ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/kids'>
                        <img src="/images/kids-meal.png" alt="kids-meal" />
                        <h5>ДЕТСКО МЕНЮ</h5>
                    </Link>
                </li>
            </ul>
        </section>
    );
};

export default Thumbs;