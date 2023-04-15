
import { FoodContext } from '../../context/FoodContext';
import { useContext } from 'react';

import styles from './Trolley.module.css';

const TrolleyItem = () => {

    const { cartItem, onRemoveFromCart } = useContext(FoodContext);

    return (
        <>
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
                        <p className={styles['p-price']}> {Number(c.newPrice).toFixed(2)}лв.</p>
                        <button onClick={() => onRemoveFromCart(c._id)} className={styles['remove-cart']}>&#10008;</button>
                    </li>
                </div>) || []}
        </>
    );
};

export default TrolleyItem;