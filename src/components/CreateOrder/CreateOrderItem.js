
import { useContext } from 'react';
import { FoodContext } from '../context/FoodContext';

import styles from './CreateOrder.module.css';

const CreateOrderItem = () => {

    const { cartItem, onRemoveFromCart, onAddToCart, onRemoveOneItem } = useContext(FoodContext);

    const onAddItem = (food) => {
        console.log(food);
        onAddToCart({...food, count:1});
    };

    const removeItem = (food) => {
        onRemoveOneItem(food);
    };

    return (
        <>
            {cartItem?.map(c => <div key={c._id} className={styles['cart-row']}>
                <h3 className={styles['cart-row-title']}>{c.title}</h3>
                <div className={styles['cart-row-counter']}>

                    <button onClick={() => removeItem(c)} className={styles['add-remove-btn']}> - </button>
                    {/* <input className={styles['cart-input']} value={c.count} /> */}
                    <span>{c.count}</span>
                    <button onClick={() => onAddItem(c)} className={styles['add-remove-btn']}> + </button>
                </div>

                <h5 className={styles['cart-row-price']}>
                    <span className={styles['cart-row-span']}>{c.newPrice.toFixed(2)}</span>лв.
                </h5>
                <button onClick={() => onRemoveFromCart(c._id)} className={styles['del-btn']}>ИЗТРИЙ <span className={styles['x-span']}>&#10008;</span></button>
            </div>) || []}</>
    );
};

export default CreateOrderItem;