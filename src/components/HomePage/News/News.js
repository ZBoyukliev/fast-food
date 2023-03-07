import styles from './News.module.css';

const News = () => {
    return (
        <section className={styles['news']}>
        <div className={styles['news-title']}>
            <h3>НОВИНИ</h3>
        </div>
        <div className={styles['news-pictures']}>
            <div className={styles['news-pictures-child']}>
                <img className={styles['news-img1']} src="/images/fit_317_317 (2).jpg" alt="photo1" />
                <div className={styles['news-desc']}>
                    <p> ПРЕЗ ФЕВРУАРИ </p>
                </div>
            </div>
            <div className={styles['news-pictures-child']}>
                <img className={styles['news-img2']} src="/images/fit_317_317 (1).jpg" alt="photo2" />
                <div className={styles['news-desc']}>
                    <p> ПЕЧЕЛИВШИЯТ УЧАСТНИК В КОЛЕДА С ALADIN FOODS </p>
                </div>
            </div>
            <div className={styles['news-pictures-child']}>
                <img className={styles['news-img3']} src="/images/fit_317_317.jpg" alt="photo3" />
                <div className={styles['news-desc']}>
                    <p>СПЕЧЕЛИ АЍФОН С АЛАДИН</p>
                </div>
            </div>
        </div>
    </section>
    );
};

export default News;