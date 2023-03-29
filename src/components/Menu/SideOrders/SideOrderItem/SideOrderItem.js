import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FoodContext } from '../../../context/FoodContext';
import styles from '../SideOrders.module.css';

const SideOrderItem = ({
    food
}) => {

    const { onAddToCart } = useContext(FoodContext);

    const onAddItem = () => {
        onAddToCart({...food, count:1});
    };
    
    return (
        <div className={styles['menu-sec-product']}>
        <h3 className={styles['menu-sec-title']}>{food.title}</h3>
        <img src={food.imageUrl} alt='meal' />
        <div className={styles['menu-price']}>
            <span>{food.priceLv}</span>
            <span>{food.priceSt}</span>
            <span>лв.</span>
        </div>
        <div className={styles['div-btn']}>
            {/* <button className={styles['btn']}>МЕНЮ</button> */}
            <Link to={`/menu/${food.category}/${food._id}`} className={styles['btn']}>ДЕТАЍЛИ</Link>
            <button onClick={ onAddItem} className={styles['btn']}>ДОБАВИ</button>
        </div>
    </div>
    );
};

export default SideOrderItem;