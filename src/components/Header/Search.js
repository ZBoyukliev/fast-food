import { useContext } from 'react';
import { FoodContext } from '../context/FoodContext';
import Trolley from '../Trolley/Trolley';
import styles from '../Menu/SideOrders/SideOrders.module.css';
import MainFoodItem from '../Menu/SideOrders/SideOrderItem/SideOrderItem';


const Search = () => {

    const { searchFood } = useContext(FoodContext);

    return (
        <>
        <main className={styles['main']}>
            <Trolley />
            <section className={styles['menu']}>

                <div className={styles['menu-sec']}>
                    {searchFood.length === 0 && 
                    <>
                    <h1 className={styles['menu-sec-title']}>НЯМА НАМЕРЕНИ РЕЗУЛТАТИ!</h1>
                    <h2 className={styles['menu-sec-title2']}>МОЛЯ ОПИТАИТЕ ОТНОВО НА КИРИЛИЦА!</h2>
                    </>}
                    {searchFood.map(f => <MainFoodItem key={f._id} {...f} />)}

                </div>
            </section>
        </main>
    </>
    );
};

export default Search;