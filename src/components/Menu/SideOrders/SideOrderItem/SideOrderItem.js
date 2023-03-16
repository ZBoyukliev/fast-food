import { Link } from 'react-router-dom';
import styles from '../SideOrders.module.css';

const SideOrderItem = ({
    title,
    imageUrl,
    priceLv,
    priceSt,
    category,
    _id
}) => {
    return (
        <div className={styles['menu-sec-product']}>
        <h3 className={styles['menu-sec-title']}>{title}</h3>
        <img src={imageUrl} alt='meal' />
        <div className={styles['menu-price']}>
            <span>{priceLv}</span>
            <span>{priceSt}</span>
            <span>лв.</span>
        </div>
        <div className={styles['div-btn']}>
            {/* <button className={styles['btn']}>МЕНЮ</button> */}
            <Link to={`/${category}/${_id}`} className={styles['btn']}>ДЕТАЍЛИ</Link>
            <button className={styles['btn']}>ДОБАВИ</button>
        </div>
    </div>
    );
};

export default SideOrderItem;