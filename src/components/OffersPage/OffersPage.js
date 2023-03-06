import Offers from '../HomePage/Offers/Offers';
import Trolley from '../Menu/Trolley/Trolley';
import styles from './OffersPage.module.css';

const OffersPage = () => {
    return (
        <>
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['container']}>
                    {/* <img src="/images/slide-picture-burger.jpg" alt="burger" /> */}
                </section>
                <Offers />
            </main>
        </>
    );
};

export default OffersPage;