import News from '../HomePage/News/News';
import styles from './WhatsNew.module.css';

const WhatsNew = ({src}) => {

    return (
        <main className={styles['main']}>
            <section className={styles['container']}>
                <img src={src} alt="burger" />
            </section>
            < News />
        </main>
    );
};

export default WhatsNew;
