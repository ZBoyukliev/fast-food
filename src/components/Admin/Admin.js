
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as menuService from '../../services/menuService';
import styles from './Admin.module.css';
import Spinner from '../Spinner/Spinner';
import ArrowToTop from '../ArrowToTop/ArrowToTop';

const Admin = () => {

    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [err, setErr] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        menuService.getAll()
            .then(res => {
                setProduct(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setErr(true);
                setProduct([]);
            });
    }, []);

    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(product);
    }, [product]);

    const onDeletProduct = (foodId) => {
        menuService.remove(foodId);
        setProduct(state => state.filter(x => x._id !== foodId));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);

        const filtered = product.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        if (event.target.value === '') {
            setFilteredData(product);
        }
    };

    return (
        <>
            {isLoading ? <Spinner /> :
                <main className={styles['main']}>
                    <ArrowToTop />
                    <div className={styles['menu-sec']}>
                        <section className={styles['menu']}>
                            {err ? <h1 className={styles['menu-sec-title']}>НЯМА НАЛИЧНИ ПРОДУКТИ</h1> :
                                <>
                                    <div className={styles['menu-sec-input']}>
                                        <p>намери продукт</p>
                                        <input type="text" value={searchTerm} onChange={handleSearch} />
                                    </div>
                                    <Link className={styles['div-btn-add']} to={'/create'}>ДОБАВИ ПРОДУКТ</Link>
                                    <div className={styles['menu-sec']}>

                                        {filteredData.map(d =>
                                            <div key={d._id} className={styles['menu-sec-product']}>
                                                <h3 className={styles['menu-sec-title']}>{d.title.toUpperCase()}</h3>
                                                <img src={d.imageUrl} alt='meal' />
                                                <div className={styles['menu-price']}>
                                                    <span>{d.priceLv}</span>
                                                    <span>{d.priceSt}</span>
                                                    <span>лв.</span>
                                                </div>
                                                <div className={styles['div-btn']}>
                                                    <Link to={`/menu/${d.category}/${d._id}`} className={styles['btn']}>ДЕТАЍЛИ</Link>
                                                    <Link to={`/edit/${d._id}`} className={styles['btn']}>РЕДАКТИРАЙ</Link>
                                                    <button onClick={() => window.confirm(`Сигурни ли сте че искате да изтриете ${d.title} от менюто?`) && onDeletProduct(d._id)} className={styles['btn-x']}>ИЗТРИЙ</button>
                                                </div>
                                            </div>
                                        )};

                                        {product.length === 0 && <h1 className={styles['no-products-msg']}>НЯМА НАЛИЧНИ ПРОДУКТИ.</h1>}

                                    </div>
                                </>}
                        </section>
                    </div>
                </main>
            }

        </>
    );
};

export default Admin;