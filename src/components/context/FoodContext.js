import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as menuService from '../../services/menuService';

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
        cartItem.forEach(c => sum += c.price);
        setTotalPrice(sum);
    }, [cartItem, setTotalPrice]);

    const onAddToCart = (food) => {
        setCartItem(state => {
            const item = state.find(i => i._id === food._id);
            let count = food.count;
            let price = food.price;

            if (item) {
                count = item.count + 1;
                price += item.price;
                return state.map(f => f._id === item._id ? { ...f, count: count, price: price } : f);
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
        <FoodContext.Provider value={{ onSearch, onAddToCart, searchFood, cartItem, onRemoveFromCart, totalPrice }}>
            {children}
        </FoodContext.Provider>
    );
};