import * as menuService from '../../services/menuService';
import styles from './FoodDetails.module.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Subnav from '../Subnav/Subnav';


const FoodDetails = () => {

    const { foodId } = useParams();
    const [food, setFood] = useState({});

    useEffect(() => {
        menuService.getById(foodId)
            .then(result => {
                setFood(result);
            });
    }, [foodId]);

    return (
        <div>
            <Subnav />
            <section className={styles['main-details']}>
                <aside className={styles['info']}>
                    <Link>Обратно</Link>
                    <h3 className={styles['info-tittle']}>{food.title}</h3>
                    <h5>Съдаржание</h5>
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
                </section>
            </section>
        </div>
    );
};

export default FoodDetails;