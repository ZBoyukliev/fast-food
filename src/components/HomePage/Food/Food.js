import { Link } from 'react-router-dom';
import styles from './Food.module.css';

const Food = () => {

    return (

        <section className={styles['container']}>
            <img src="/images/slide-picture-duner.jpg" alt="doner" />
            <div className={styles['content']}>
                <h1 className={styles['title']}>ДЮ НЕР</h1>
                <p className={styles['desc']}>
                    Поръчай вкусен дюнер от голямото ни разнообразие с пилешко, телешко е панирано месо, в питка
                    или порция
                </p>
                <Link to='/menu/doner' className={styles['btn-order']}>ПОРЪЧАЙ</Link>
            </div>
        </section>
        
    );
};

export default Food;