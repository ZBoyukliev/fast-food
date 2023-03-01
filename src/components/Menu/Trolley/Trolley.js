import styles from './Trolley.module.css';

const Trolley = () => {
    return (
        <div className={styles[`trolley`]}>
        <header className={styles[`trolley-head`]}>
            КОЛИЧКА
        </header>
        <p>
            В момента нямате добавени артикули в количката
        </p>
    </div>
    );
};

export default Trolley;