import Offers from '../HomePage/Offers/Offers';
import styles from './OffersPage.module.css';

const OffersPage = () => {
    return (
        <>
            <main className={styles['main']}>
                <section className={styles['container']}>
                    {/* <img src="/images/slide-picture-burger.jpg" alt="burger" /> */}
                </section>
                <Offers />
            </main>
        </>
    );
};

export default OffersPage;