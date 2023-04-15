
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import * as menuService from '../../services/menuService';
import styles from './Admin.module.css';
import Spinner from '../Spinner/Spinner';

const Admin = () => {

    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        menuService.getAll()
            .then(res => {
                setProduct(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setProduct([]);
            });
    }, []);

    const onDeletProduct = (foodId) => {
        menuService.remove(foodId);
        setProduct(state => state.filter(x => x._id !== foodId));
    };

    return (
        <>

            {isLoading ? <Spinner /> :
                <main className={styles['main']}>
                    <div className={styles['menu-sec']}>
                        <section className={styles['menu']}>
                            <Link className={styles['div-btn-add']} to={'/admin/create'}>ДОБАВИ ПРОДУКТ</Link>
                            <div className={styles['menu-sec']}>

                                {product.map(d =>
                                    <div key={d._id} className={styles['menu-sec-product']}>
                                        <h3 className={styles['menu-sec-title']}>{d.title}</h3>
                                        <img src={d.imageUrl} alt='meal' />
                                        <div className={styles['menu-price']}>
                                            <span>{d.priceLv}</span>
                                            <span>{d.priceSt}</span>
                                            <span>лв.</span>
                                        </div>
                                        <div className={styles['div-btn']}>
                                            <Link to={`/admin/${d.category}/${d._id}`} className={styles['btn']}>ДЕТАЍЛИ</Link>
                                            <button className={styles['btn']}>РЕДАКТИРАЙ</button>
                                            <button onClick={() =>  window.confirm(`Сигурни ли сте че искате да изтриете ${d.title} от менюто?`) && onDeletProduct(d._id)} className={styles['btn-x']}>ИЗТРИЙ</button>
                                        </div>
                                    </div>
                                )};

                            </div>
                        </section>
                    </div>
                </main>
            }

        </>
    );
};

export default Admin;