
import styles from './CreateOrder.module.css';

const CreateOrder = () => {
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
                        <div className={styles['cart-row']}>
                            <h3 className={styles['cart-row-title']}>ROLLER</h3>
                            <div className={styles['cart-row-counter']}>

                                <button className={styles['add-remove-btn']}> - </button>
                                <input className={styles['cart-input']} defaultValue={1} />
                                <button className={styles['add-remove-btn']}> + </button>
                            </div>

                            <h5 className={styles['cart-row-price']}>
                                <span className={styles['cart-row-span']}>8.50</span>лв.
                            </h5>
                            <button className={styles['del-btn']}>ИЗТРИЙ <span className={styles['x-span']}>&#10008;</span></button>
                        </div>
                    </section>

                    <section>

                    </section>

                </section>
            </main>
        </>
    );
};

export default CreateOrder;