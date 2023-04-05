import { createContext, useEffect, useState } from 'react';

export const FoodContext = createContext();

export const FoodProvider = ({
    children
}) => {

    const [cartItem, setCartItem] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showDiscount, setShowDiscount] = useState(true);

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
                return state.map(f => f._id === item._id ? { ...f, count: count, newPrice: price } : f);
            } else {
                return [...state, food];
            }
        });
    };

    const onDiscountCheck = (input) => {
        if (input === 'DISC20') {
            setTotalPrice(state => state *= 0.8);
            setShowDiscount(false);
        };
        if (input === 'DISC10') {
            setTotalPrice(state => state *= 0.9);
            setShowDiscount(false);
        };

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

    return (
        <FoodContext.Provider value={{
            cartItem,
            totalPrice,
            showDiscount,
            onAddToCart,
            onRemoveFromCart,
            onRemoveOneItem,
            onDiscountCheck
        }}>
            {children}
        </FoodContext.Provider>
    );
};