import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as menuService from '../../../services/menuService';

import styles from './Offers.module.css';

const Offers = () => {

    const [offer, setOffer] = useState([]);

    useEffect(() => {
        menuService.getOffers()
            .then(res => {
                setOffer(res);
            });
    }, []);

    return (
                <section className={styles['offers']}>
                    <div className={styles['offers-title']}>
                        <h3>ПРОМОЦИИ</h3>
                    </div>
                    <div className={styles['offers-pictures']}>
                        {offer.map(o =>

                            <div key={o._id}>
                                <Link to={`/offers/${o._id}`}>
                                    <img className={styles['offers-img1']} src={o.imageUrl1} alt="master-combo" />
                                    <div className={styles['offers-desc']}>
                                        <p>{o.title}</p>
                                    </div>
                                </Link>
                            </div>

                        )}

                    </div>
                </section>
    );
};

export default Offers;