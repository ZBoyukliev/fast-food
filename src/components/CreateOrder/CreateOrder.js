
import { useContext, useState } from 'react';
import { FoodContext } from '../../context/FoodContext';

import { useForm } from '../../hooks/useForm';
import styles from './CreateOrder.module.css';
import CreateOrderItem from './CreateOrderItem';
import AddressForm from './AddressForm/AddressForm';
import { AuthContext } from '../../context/AuthContext';

const CreateOrder = () => {

    const { totalPrice, onDiscountCheck, showDiscount } = useContext(FoodContext);
    const { user } = useContext(AuthContext);
    const { values, onChangeHandler } = useForm({ code: '' });
    const { cartItem } = useContext(FoodContext);
    const [showForm, setShowForm] = useState(false);

    const onContinue = () => {
        setShowForm(true);
    };


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
                        {cartItem.map(c => <CreateOrderItem key={c._id} food={c} />)}
                    </section>

                    <section className={styles['prices']}>


                        {showDiscount && <div className={styles['discount-code']}>
                            <h3 className={styles['discount-code-title']}>Код за отстъпка:</h3>
                            <input
                                className={styles['discount-code-inp']}
                                type="code"
                                id="code"
                                name="code"
                                value={values.code}
                                onChange={onChangeHandler} />

                            <button onClick={() => onDiscountCheck(values.code)} className={styles['discount-code-btn']}>ПРИЛОЖИ</button>
                        </div >}


                        <div className={styles['sum-to-pay']}>
                            <h2 className={styles['sum-to-pay-title']}>Общо: {totalPrice.toFixed(2)}лв.</h2>
                        </div>

                    </section>
                    {user.userId ? (!showForm ? <div className={styles['continue']}>
                        <button onClick={onContinue} className={styles['continue-btn']}>ПРОДЪЛЖИ</button>
                    </div> :
                        <AddressForm />) : <h4>ЗА ДА ПОРЪЧАТЕ МОЛЯ ВЛЕЗТЕ В СВОЯ ПРОФИЛ</h4>}




                </section>
            </main>
        </>
    );
};

export default CreateOrder;