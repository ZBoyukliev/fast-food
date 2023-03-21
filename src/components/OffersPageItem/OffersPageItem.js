import styles from './OffersPageItem.module.css';

const OffersPageItem = () => {
    return (
        <main className={styles['main']}>
            <section className={styles['container']}>
                {/* <img src="/images/slide-picture-burger.jpg" alt="burger" /> */}
            </section>
            {/* <Offers /> */}
            <section className={styles['offers']}>
                <div className={styles['offers-title']}>
                    <h3>ПРОМОЦИИ</h3>
                </div>
                <div className={styles['offers-pictures']}>
                    <aside className={styles['aside-img']}>
                        <img src='/images/offers/teleshko-izkushenie.jpg' alt='meal' />
                    </aside>
                    <div className={styles['text']}>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Eos maiores ipsa eum a, nihil fugit quas repudiandae,
                            impedit quis suscipit numquam praesentium, quos temporibus porro dolores consequatur veritatis.
                            Numquam, veniam?
                        </p>
                       
                    </div>
                </div>
                <button className={styles['order-btn']}>ПОРЪЧАЙ</button>
            </section>
        </main>
    );
};

export default OffersPageItem;