import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { FoodContext } from '../context/FoodContext';

import styles from './Trolley.module.css';

const Trolley = () => {

    const { cartItem, onRemoveFromCart } = useContext(FoodContext);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let sum = 0;
        cartItem.forEach(c => sum += c.price);
        setTotalPrice(sum);
    }, [cartItem, setTotalPrice]);


    return (
        <div className={styles['outer']}>
            <div className={styles['trolley']}>

                <header className={styles['trolley-head']}>
                    <h3 className={styles['trolley-head-tittle']}><i className="fa-solid fa-cart-shopping"></i>КОЛИЧКА</h3>
                </header>

                <div className={styles['items']}>
                    <ul className={styles['items-aded']}>

                        {cartItem.length === 0 &&
                            <div className={styles['items-aded-inner']}>
                                <li className={styles['items-aded-li']}>
                                    В момента нямате добавени артикули в количката
                                </li>
                            </div>}

                        {cartItem?.map(c =>
                            <div key={c._id} className={styles['items-aded-inner']}>
                                <li className={styles['items-aded-li']}>
                                    <p>{c.count}</p>
                                    <p className={styles['p-title']}>{c.title}</p>
                                    <p className={styles['p-price']}> {c.price.toFixed(2)}лв.</p>
                                    <button onClick={() =>onRemoveFromCart(c._id)} className={styles['remove-cart']}>&#10008;</button>
                                </li>
                            </div>) || []}

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