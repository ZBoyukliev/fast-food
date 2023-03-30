
import { useContext } from 'react';
import { FoodContext } from '../context/FoodContext';

import styles from './CreateOrder.module.css';

const CreateOrder = () => {

    const { cartItem, onRemoveFromCart, totalPrice } = useContext(FoodContext); 

    return (
        <>
            <main className={styles['main']}>
                <section className={styles['container']}>
                    <img src="/images/pizza/order.jpg" alt="drinks" />
                </section>

                <section className={styles['menu']}>
                    <div className={styles['menu-title']}>
                        <h3>КОЛИЧКА</h3>
                    </div>

                    <section className={styles['cart-table']}>

                        {cartItem?.map( c => <div key={c._id} className={styles['cart-row']}>
                            <h3 className={styles['cart-row-title']}>{c.title}</h3>
                            <div className={styles['cart-row-counter']}>

                                <button className={styles['add-remove-btn']}> - </button>
                                <input className={styles['cart-input']} defaultValue={c.count} />
                                <button className={styles['add-remove-btn']}> + </button>
                            </div>

                            <h5 className={styles['cart-row-price']}>
                                <span className={styles['cart-row-span']}>{c.price.toFixed(2)}</span>лв.
                            </h5>
                            <button onClick={() => onRemoveFromCart(c._id)} className={styles['del-btn']}>ИЗТРИЙ <span className={styles['x-span']}>&#10008;</span></button>
                        </div>) || []}

                    </section>

                    <section className={styles['prices']}>

                        <div className={styles['discount-code']}>
                            <h3 className={styles['discount-code-title']}>Код за отстъпка:</h3>
                            <input className={styles['discount-code-inp']} />
                            <button className={styles['discount-code-btn']}>ПРИЛОЖИ</button>
                        </div >

                        <div className={styles['sum-to-pay']}>
                            <h2 className={styles['sum-to-pay-title']}>Общо: {totalPrice.toFixed(2)}лв.</h2>
                        </div>

                    </section>
                    <div className={styles['continue']}>
                        <button className={styles['continue-btn']}>ПРОДЪЛЖИ</button>
                    </div>

                </section>
            </main>
        </>
    );
};

export default CreateOrder;