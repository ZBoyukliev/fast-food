import { useContext } from 'react';
import { FoodContext } from '../../context/FoodContext';

import styles from './CreateOrder.module.css';

const Receipt = () => {

    const { reseiptInfo, receiptItems, onClose} = useContext(FoodContext);

    return (
        <main className={styles['main']}>
                    <section className={styles['final-order']}>
                        <div>
                        <p>{reseiptInfo.firstname}</p>
                            <p>{reseiptInfo.surename}</p>
                            <p>{reseiptInfo.town}</p>
                            <p>{reseiptInfo.phonenumber}</p>
                            <p>{reseiptInfo.address}</p>
                            <p>{reseiptInfo.email}</p>
 
 
                            <ul>
                                {receiptItems.map(i => <li>{i.title} {i.count} {i.newPrice.toFixed(2)} лв.</li>)}
                            </ul>
                            <p>отстъпка: {reseiptInfo.discount.toFixed(2)} лв.</p>
                            <p>общо: {reseiptInfo.finalPrice.toFixed(2)} лв.</p>
                            <button onClick={onClose}>Затвори</button>
                        </div>
                    </section>
                </main>
    );
};

export default Receipt;