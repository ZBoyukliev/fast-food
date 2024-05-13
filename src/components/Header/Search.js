import { SearchContext } from '../../context/SearchContext';
import { useContext } from 'react';
import Trolley from '../Trolley/Trolley';
import styles from '../Menu/SideOrders/SideOrders.module.css';
import MainFoodItem from '../Menu/SideOrders/SideOrderItem/SideOrderItem';
import Spinner from '../Spinner/Spinner';

const Search = () => {

    const { searchFood, isLoading } = useContext(SearchContext);

    return (
        <>
            <main className={styles['main']}>
                <Trolley />
                <section className={styles['menu']}>

                    <div className={styles['menu-sec']}>
                        {searchFood.length === 0 &&
                            <>
                                <h1 className={styles['menu-sec-title']}>НЯМА НАМЕРЕНИ РЕЗУЛТАТИ!</h1>
                                <h2 className={styles['menu-sec-title2']}>МОЛЯ ОПИТАИТЕ ОТНОВО!</h2>
                            </>}
                            {isLoading ? <Spinner/> : 
                            searchFood.map(f => <MainFoodItem key={f._id} food={f} />)}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Search;
