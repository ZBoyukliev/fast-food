import { FoodContext } from '../../context/FoodContext';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as menuService from '../../services/menuService';
import * as likeService from '../../services/likeService';
import styles from './FoodDetails.module.css';
import Subnav from '../Subnav/Subnav';
import Trolley from '../Trolley/Trolley';

const FoodDetails = () => {

    const { onAddToCart } = useContext(FoodContext);
    const { user } = useContext(AuthContext);
    const [food, setFood] = useState({});
    const [likes, setLikes] = useState([]);
    const [totalLikes, setTotalLikes] = useState(0);
    const [hasLike, setHasLike] = useState(0);
    const { foodId } = useParams();
    const navigate = useNavigate();

    const onAddItem = () => {
        onAddToCart({ ...food, count: 1, newPrice: food.price });
    };

    useEffect(() => {
        const allPromises = Promise.all([
            menuService.getById(foodId),
            likeService.getAllLikes(),
            likeService.getLikesByFoodId(foodId),
            likeService.getMyLikeByFoodId(foodId, user.userId),
        ]);
        allPromises.then(result => {
            const [food, likes, totalLikes, hasLike] = result;
            setFood(food);
            setLikes(likes);
            setTotalLikes(totalLikes);
            setHasLike(hasLike);
        })
        .catch((error) => {
            navigate('/404');
        });
    }, [foodId, user, navigate]);

    const onLike = async () => {
        const result = await likeService.likeFood(foodId);
        setLikes(state => [...state, result]);
        setHasLike(1);
        setTotalLikes(state => state + 1);
    };

    const onDislike = async () => {
        setHasLike(0);
        setTotalLikes(state => state - 1);
        const food = likes.filter(f => f.foodId === foodId && f._ownerId === user.userId)[0];
        await likeService.dislikeFood(food._id);
    };

    return (
        <div>
            <Subnav />
            {!user.admin &&  <Trolley />}  
            <section className={styles['main-details']}>
                <aside className={styles['info']}>
                    <Link onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i>Обратно</Link>
                    <h3 className={styles['info-tittle']}>{food.title}</h3>
                    <h4>Съдаржание</h4>
                    <ul>
                        {food.content?.map(c => (
                            <li key={c}>{c}</li>
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
                       {!user.admin && <button onClick={onAddItem} className={styles['footer-btn']}>ДОБАВИ</button>} 
                        {!user.admin ? 
                           (user.userId ? 
                            hasLike < 1 ?
                              (<button onClick={onLike} className={styles['like']}>
                                  <i className="fa-regular fa-thumbs-up fa-2x"></i>
                              </button>) :
                              (<button onClick={onDislike} className={styles['dislike']}>
                                  <i className="fa-solid fa-thumbs-up fa-2x"></i>
                              </button>)
                           : null) : null}
                        
                        <p className={styles['count-p']}>ХАРЕСВАНИЯ - </p>
                        <p className={styles['count-p2']}>{totalLikes}</p>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default FoodDetails;
