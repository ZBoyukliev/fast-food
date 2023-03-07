import styles from './Offers.module.css';

const Offers = () => {
    return (
        <section className={styles['offers']}>
            <div className={styles['offers-title']}>
                <h3>ПРОМОЦИИ</h3>
            </div>
            <div className={styles['offers-pictures']}>
                <div>
                    <img className={styles['offers-img1']} src="/images/master-combo.jpg" alt="master-combo" />
                    <div className={styles['offers-desc']}>
                        <p>МАСТЪР КОМБО</p>
                    </div>
                </div>
                <div>
                    <img className={styles['offers-img2']} src="/images/pizza-ta-dranka.jpg" alt="pizza-meal" />
                    <div className={styles['offers-desc']}>
                        <p>ПИЦА, ТА ДРЪНКА</p>
                    </div>
                </div>
                <div>
                    <img className={styles['offers-img3']} src="/images/teleshko-izkushenie.jpg" alt="teleshko-meal" />
                    <div className={styles['offers-desc']}>
                        <p>ТЕЛЕШКО ИЗКУШЕНИЕ</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Offers;