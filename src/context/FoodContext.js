import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as menuService from '../services/menuService';

export const FoodContext = createContext();

export const FoodProvider = ({
    children
}) => {

    const [searchFood, setSearchFood] = useState([]);
    const [cartItem, setCartItem] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();


    useEffect(() => {
        let sum = 0;
        cartItem.forEach(c => sum += c.newPrice);
        setTotalPrice(sum);
    }, [cartItem, setTotalPrice]);

    const onAddToCart = (food) => {
        setCartItem(state => {
            const item = state.find(i => i._id === food._id);
            let count = food.count;
            let price = food.price;

            if (item) {
                count = item.count + 1;
                price += item.newPrice;
                console.log(item.newPrice);
                console.log(item.price);
                return state.map(f => f._id === item._id ? { ...f, count: count, newPrice: price } : f);
            } else {
                return [...state, food];
            }
        });
    };

    const onRemoveOneItem = (food) => {
        setCartItem(state => {
            const item = state.find(i => i._id === food._id);
            let count = food.count;

            if (item) {
             
                count = item.count - 1;
                item.newPrice -= item.price;

                if (count <= 0) {
                    onRemoveFromCart(food._id);
                 }

                return state.map(f => f._id === item._id ? { ...f, count: count, newPrice: item.newPrice } : f);
            } else {
                return [...state, food];
            }

        });

    };

    const onRemoveFromCart = (id) => {
        setCartItem(state => state.filter(f => f._id !== id));
    };

    const onSearch = async (e, search) => {
        e.preventDefault();

        const foodName = search.search;
        const result = await menuService.searchFood(foodName);

        setSearchFood(result);
        navigate('/search');
    };

    return (
        <FoodContext.Provider value={{ onSearch, onAddToCart, searchFood, cartItem, onRemoveFromCart, totalPrice, onRemoveOneItem }}>
            {children}
        </FoodContext.Provider>
    );
};