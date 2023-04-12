import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles['not-found']}>
            <img src='/images/background/404-page.jpg' alt='404'/>
        </div>
    );
};

export default NotFound;