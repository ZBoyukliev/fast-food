import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodContext } from '../../context/FoodContext';

import * as menuService from '../../services/menuService';
import styles from './FoodDetails.module.css';
import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';


const FoodDetails = () => {

    const { foodId } = useParams();
    const [food, setFood] = useState({});
    const navigate = useNavigate();

    const { onAddToCart } = useContext(FoodContext);

    const onAddItem = () => {
        onAddToCart({ ...food, count: 1, newPrice: food.price });
    };

    useEffect(() => {
        menuService.getById(foodId)
            .then(result => {
                setFood(result);
            });
    }, [foodId]);

    return (
        <div>
            <Subnav />
            <Trolley />
            <section className={styles['main-details']}>
                <aside className={styles['info']}>
                    <Link onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i>Обратно</Link>
                    <h3 className={styles['info-tittle']}>{food.title}</h3>
                    <h4>Съдаржание</h4>
                    <ul>
                        {food.content?.map(c => (
                            <li>{c}</li>
                        )) || []}
                    </ul>
                </aside>
                <section className={styles['photo']}>
                    <div className={styles['food-type']}>
                        {food.category1}
                    </div>
                    <div className={styles['menu-sec-product']}>
                        <img src={food.imageUrl} alt='meal' />
                        <div className={styles['menu-price']}>
                            <span>{food.priceLv}</span>
                            <span>{food.priceSt}</span>
                            <span>лв.</span>
                        </div>
                    </div>
                    <div className={styles['footer']}>
                        <button onClick={onAddItem} className={styles['footer-btn']}>ДОБАВИ</button>
                        {/* <button className={styles['footer-btn']}>ИЗБЕРИ МЕНЮ</button> */}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default FoodDetails;