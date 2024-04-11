import { FoodContext } from '../../context/FoodContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Trolley.module.css';
import TrolleyItem from './TrolleyItem';

const Trolley = () => {

    const {  totalPrice } = useContext(FoodContext);

    return (
        <div className={styles['outer']}>
            <div className={styles['trolley']}>

                <header className={styles['trolley-head']}>
                    <h3 className={styles['trolley-head-tittle']}><i className="fa-solid fa-cart-shopping"></i>КОЛИЧКА</h3>
                </header>

                <div className={styles['items']}>
                    <ul className={styles['items-aded']}>

                        <TrolleyItem />

                    </ul>
                    <div className={styles['calc-sum']}>
                        <small className={styles['small']}>МЕЖДИННА СУМА: {totalPrice.toFixed(2)}</small>
                        <h3 className={styles['calc-sum-head']}>лв.</h3>
                    </div>
                </div>

                <footer className={styles['trolley-footer']}>
                    <Link to='/createorder' className={styles['trolley-link-btn']}>ПОРЪЧАЙ</Link>
                </footer>

            </div>
        </div>
    );
};

export default Trolley;
