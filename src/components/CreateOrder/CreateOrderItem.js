
import { useContext } from 'react';
import { FoodContext } from '../../context/FoodContext';

import styles from './CreateOrder.module.css';

const CreateOrderItem = ({food}) => {

    const {  onRemoveFromCart, onAddToCart, onRemoveOneItem } = useContext(FoodContext);

    const onAddItem = (food) => {
        onAddToCart({...food, count:1});
    };

    const removeItem = (food) => {
        onRemoveOneItem(food);
    };

    return (
            <div className={styles['cart-row']}>
                <h3 className={styles['cart-row-title']}>{food.title}</h3>
                <div className={styles['cart-row-counter']}>

                    <button onClick={() => removeItem(food)} className={styles['add-remove-btn']}> - </button>
                    <span>{food.count}</span>
                    <button onClick={() => onAddItem(food)} className={styles['add-remove-btn']}> + </button>
                </div>

                <h5 className={styles['cart-row-price']}>
                    <span className={styles['cart-row-span']}>{food.newPrice.toFixed(2)}</span>лв.
                </h5>
                <button onClick={() => onRemoveFromCart(food._id)} className={styles['del-btn']}>ИЗТРИЙ <span className={styles['x-span']}>&#10008;</span></button>
            </div>
    );
};

export default CreateOrderItem;