import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import * as menuService from '../../services/menuService';

import styles from './OffersPageItem.module.css';

const OffersPageItem = () => {

    const [offer, setOffer] = useState({});
    
    const { offerId } = useParams();

    useEffect(() => {
        menuService.getById(offerId)
            .then(result => {
                setOffer(result);
            });
    }, [offerId]);

    return (
        <main className={styles['main']}>
            <section className={styles['container']}>
                {/* <img src="/images/slide-picture-burger.jpg" alt="burger" /> */}
            </section>
            {/* <Offers /> */}
            <section className={styles['offers']}>
                <div className={styles['offers-title']}>
                    <h3>ПРОМОЦИИ</h3>
                </div>
                <div className={styles['offers-pictures']}>
                    <aside className={styles['aside-img']}>
                        <img src={offer.imageUrl2} alt='meal' />
                    </aside>
                    <div className={styles['text']}>
                        <p>
                            {offer.offerdesc}
                        </p>

                    </div>
                </div>
                <Link className={styles['order-btn']} to={`/menu/${offer.category}/${offer._id}`}>ПОРЪЧАЙ </Link>
            </section>
        </main>
    );
};

export default OffersPageItem;