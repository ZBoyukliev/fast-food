import Thumbs from '../HomePage/Thumbs/Thumbs';
import Subnav from '../Subnav/Subnav';
import styles from './MenuNavPage.module.css';

const MenuNavPage = ({src}) => {
    return (
        <>
            <Subnav />
            <main className={styles['main']}>
                <section className={styles['container']}>
                    <img src={src} alt="duner" />
                </section>
                <Thumbs />
            </main>
        </>
    );
};

export default MenuNavPage;
