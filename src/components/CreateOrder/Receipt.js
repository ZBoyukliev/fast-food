import { useContext } from 'react';
import { FoodContext } from '../../context/FoodContext';

import styles from './CreateOrder.module.css';

const Receipt = () => {

    const { reseiptInfo, receiptItems, onClose } = useContext(FoodContext);

    return (
        <main className={styles['main']}>
            <section className={styles['final-order']}>
                <div className={styles['final-order-el']}>
                    <h1 className={styles['final-order-title']}>ВИЕ УСПЕШНО НАПРАВИХТЕ ВАШАТА ПОРЪЧКА. BON APPETIT!</h1>
                    <p className={styles['final-order-p']}>{reseiptInfo.firstname}</p>
                    <p className={styles['final-order-p']}>{reseiptInfo.surename}</p>
                    <p className={styles['final-order-p']}>{reseiptInfo.town}</p>
                    <p className={styles['final-order-p']}>{reseiptInfo.phonenumber}</p>
                    <p className={styles['final-order-p']}>{reseiptInfo.address}</p>
                    <p className={styles['final-order-p']}>{reseiptInfo.email}</p>


                    <ul className={styles['final-order-ul']}>
                        {receiptItems.map(i => <li
                         className={styles['final-order-li']}>
                            <i className="fa-solid fa-check"></i>
                           <span className={styles['final-order-sp1']}>{i.count} *</span> 
                           <span className={styles['final-order-sp2']}>{i.title}</span>
                           <span className={styles['final-order-sp1']}>-</span> 
                           <span className={styles['final-order-sp3']}>{i.newPrice.toFixed(2)} лв.</span>
                         </li>)}
                    </ul>
                    <p className={styles['final-order-disc']}>отстъпка: {reseiptInfo.discount.toFixed(2)} лв.</p>
                    <p className={styles['final-order-total']}>общо: {reseiptInfo.finalPrice.toFixed(2)} лв.</p>
                    <button onClick={onClose} className={styles['final-order-btn']}>ЗАТВОРИ</button>
                </div>
            </section>
        </main>
    );
};

export default Receipt;