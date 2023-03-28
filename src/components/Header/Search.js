import { useContext } from 'react';
import { FoodContext } from '../context/FoodContext';
import Trolley from '../Trolley/Trolley';
import styles from '../Menu/MainFood/MainFood.module.css';
import MainFoodItem from '../Menu/MainFood/MainFoodItem/MainFoodItem';


const Search = () => {

    const { searchFood } = useContext(FoodContext);

    return (
        <>
        <main className={styles['main']}>
            <Trolley />
            <section className={styles['menu']}>

                <div className={styles['menu-sec']}>
                    
                    {searchFood.map(f => <MainFoodItem key={f._id} {...f} />)}

                </div>
            </section>
        </main>
    </>
    );
};

export default Search;