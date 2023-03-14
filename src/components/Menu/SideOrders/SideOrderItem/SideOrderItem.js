import styles from '../SideOrders.module.css';

const SideOrderItem = ({
    title,
    imageUrl,
    priceLv,
    priceSt
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
            <button className={styles['btn']}>ДЕТАЍЛИ</button>
            <button className={styles['btn']}>ДОБАВИ</button>
        </div>
    </div>
    );
};

export default SideOrderItem;