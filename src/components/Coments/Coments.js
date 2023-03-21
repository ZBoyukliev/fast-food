import styles from './Coments.module.css';

const Coments = () => {
    return (
      
            <main className={styles['main']}>
                <section className={styles['coment']}>
                    <h3 className={styles['coment-title']}>ВАШИТЕ ОТЗИВИ СА ВАЖНИ ЗА НАС</h3>
                    <div className={styles['coment-sec']}>
                        <div className={styles['coment-sec-product']}>
                            <h3 className={styles['coment-sec-title']}>Pesho</h3>
                            <img src={'/images/kids-meal.png'} alt='meal' />
                            <div className={styles['coment-price']}>
                                <p>Lorem ipsum dolor sit  adipisicing elit.
                                    Ullam iure veniam voluptas aperiam unde
                                    repellendus molestias eligendi assumenda ipsa,
                                    quibusdam nulla totam similique laboriosam.</p>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>ДОБАВИ</button>
                                <button className={styles['btn']} >ИЗТРИЙ</button>
                            </div>
                        </div>
                        <div className={styles['coment-sec-product']}>
                            <h3 className={styles['coment-sec-title']}>Pesho</h3>
                            <img src={'/images/kids-meal.png'} alt='meal' />
                            <div className={styles['coment-price']}>
                                <p>Lorem ipsum dolor sit  adipisicing elit.
                                    Ullam iure veniam voluptas aperiam unde
                                    repellendus molestias eligendi assumenda ipsa,
                                    quibusdam nulla totam similique laboriosam.</p>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']} >ДОБАВИ</button>
                            </div>
                        </div>
                        <div className={styles['coment-sec-product']}>
                            <h3 className={styles['coment-sec-title']}>Pesho</h3>
                            <img src={'/images/kids-meal.png'} alt='meal' />
                            <div className={styles['coment-price']}>
                                <p>Lorem ipsum dolor sit  adipisicing elit.
                                    Ullam iure veniam voluptas aperiam unde
                                    repellendus molestias eligendi assumenda ipsa,
                                    quibusdam nulla totam similique laboriosam.</p>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']} >ДОБАВИ</button>
                            </div>
                        </div>
                        <div className={styles['coment-sec-product']}>
                            <h3 className={styles['coment-sec-title']}>Pesho</h3>
                            <img src={'/images/kids-meal.png'} alt='meal' />
                            <div className={styles['coment-price']}>
                                <p>Lorem ipsum dolor sit  adipisicing elit.
                                    Ullam iure veniam voluptas aperiam unde
                                    repellendus molestias eligendi assumenda ipsa,
                                    quibusdam nulla totam similique laboriosam.</p>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']} >ДОБАВИ</button>
                            </div>
                        </div>
                        <div className={styles['coment-sec-product']}>
                            <h3 className={styles['coment-sec-title']}>Pesho</h3>
                            <img src={'/images/kids-meal.png'} alt='meal' />
                            <div className={styles['coment-price']}>
                                <p>Lorem ipsum dolor sit  adipisicing elit.
                                    Ullam iure veniam voluptas aperiam unde
                                    repellendus molestias eligendi assumenda ipsa,
                                    quibusdam nulla totam similique laboriosam.</p>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['btn']}>МЕНЮ</button>
                                <button className={styles['btn']} >ДОБАВИ</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
       
    );
};

export default Coments;