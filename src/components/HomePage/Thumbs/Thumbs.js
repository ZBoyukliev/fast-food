import styles from './Thumbs.module.css';
import { Link } from 'react-router-dom';

const Thumbs = () => {
    return (
        <section className={styles['thumbs']}>
            <ul>
                <li>
                    <Link to='/menu/doner'>
                        <img src="/images/duner.png" alt="duner" />
                        <h5>ДЮНЕР</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/burger'>
                        <img src="/images/burgers/burger.png" alt="burger" />
                        <h5>БУРГЕР</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/pizza'>
                        <img src="/images/pizza/pizza.png" alt="pizza" />
                        <h5>ПИЦА</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/chicken'>
                        <img src="/images/chicken/chicken-fillet.png" alt="chicken" />
                        <h5>ПИЛЕ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/falafel'>
                        <img src="/images/falafel/falafel.png" alt="falafel" />
                        <h5>ФАЛАФЕЛ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/souces'>
                        <img src="/images/souces/garnituri.png" alt="garnituri" />
                        <h5>ГАРНИТУРИ И СОСОВЕ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/drinks'>
                        <img src="/images/drinks/ayran.png" alt="ayran" />
                        <h5>НАПИТКИ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/deserts'>
                        <img src="/images/deserts.png" alt="deserts" />
                        <h5>ДЕСЕРТИ</h5>
                    </Link>
                </li>
                <li>
                    <Link to='/menu/kids'>
                        <img src="/images/kids-meal.png" alt="kids-meal" />
                        <h5>ДЕТСКО МЕНЮ</h5>
                    </Link>
                </li>
            </ul>
        </section>
    );
};

export default Thumbs;