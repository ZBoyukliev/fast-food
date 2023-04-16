import styles from './ArrowToTop.module.css';

const ArrowToTop = () => {

    return (
        <>
            <div onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} className={styles['top-arrow']}>
                <i className="fa-solid fa-angle-up"></i>
            </div>
        </>
    );
};

export default ArrowToTop;