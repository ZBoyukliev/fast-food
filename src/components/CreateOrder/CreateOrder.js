import { AuthContext } from '../../context/AuthContext';
import { FoodContext } from '../../context/FoodContext';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CreateOrder.module.css';
import CreateOrderItem from './CreateOrderItem';
import AddressForm from './AddressForm/AddressForm';
import Receipt from './Receipt';

const CreateOrder = () => {

    const { totalPrice, hasOrder } = useContext(FoodContext);
    const { user } = useContext(AuthContext);
    const { cartItem } = useContext(FoodContext);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (totalPrice === 0) {
            setShowForm(false);
        }
    }, [totalPrice]);

    const onContinue = () => {
        setShowForm(true);
    };

    return (
        <>
            {!hasOrder ? <main className={styles['main']}>
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
                        <div className={styles['sum-to-pay']}>
                            <h2 className={styles['sum-to-pay-title']}>Общо: {totalPrice.toFixed(2)}лв.</h2>
                        </div>
                    </section>
                    {user.userId ? (!showForm ? <div className={styles['continue']}>
                        {totalPrice === 0 ? null : <button onClick={onContinue} className={styles['continue-btn']}>ПРОДЪЛЖИ</button>}
                    </div> :
                        <AddressForm />) : <h4
                            className={styles['warning-title']}>
                        ЗА ДА ПОРЪЧАТЕ МОЛЯ ВЛЕЗТЕ В СВОЯ ПРОФИЛ
                        <Link to='/login'>ТУК</Link>
                    </h4>}
                </section>
            </main> :
                <Receipt />
            }
        </>
    );
};

export default CreateOrder;
