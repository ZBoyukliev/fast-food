import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as menuService from '../../../services/menuService';

import styles from './Offers.module.css';
import Spinner from '../../Spinner/Spinner';

const Offers = () => {

    const [offer, setOffer] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        menuService.getOffers()
            .then(res => {
                setOffer(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setOffer([]);
                setIsLoading(false);
            });
    }, []);

    return (
                <section className={styles['offers']}>
                    <div className={styles['offers-title']}>
                        <h3>ПРОМОЦИИ</h3>
                    </div>
                    <div className={styles['offers-pictures']}>
                        {isLoading ? <Spinner /> :

                        (offer.length > 0 ? 
                            offer.map(o =>

                                <div key={o._id}>
                                    <Link to={`/offers/${o._id}`}>
                                        <img className={styles['offers-img1']} src={o.imageUrl1} alt="master-combo" />
                                        <div className={styles['offers-desc']}>
                                            <p>{o.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ) : <h2 className={styles['offer-sec-title']}>В МОМЕНТА НЯМА НАЛИЧНИ ПРОМОЦИИ.</h2> )
                        }
                    
                    </div>
                </section>
    );
};

export default Offers;