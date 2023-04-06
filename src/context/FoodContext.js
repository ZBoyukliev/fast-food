import { createContext, useEffect, useState } from 'react';

export const FoodContext = createContext();

export const FoodProvider = ({
    children
}) => {

    const [cartItem, setCartItem] = useState([]);
    const [receiptItems, setReceiptItems] = useState([]);
    const [reseiptInfo, setReceiptInfo] = useState({});
    const [hasOrder, setHasOrder] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

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

    const onDiscountSubmit = (e , values) => {
        e.preventDefault();

        let finalPrice = totalPrice;
        let discount = 0;

        if (values.code === 'DISC20') {
            discount = finalPrice * 0.2;
            finalPrice *= 0.8;
        };
        if (values.code === 'DISC10') {
            discount = finalPrice * 0.1;
            finalPrice *= 0.9;
        };

        setHasOrder(true);
        setReceiptInfo({...values, finalPrice, discount});
        setReceiptItems(cartItem);
        setCartItem([]);
    };

    const onClose = () => {
        setHasOrder(false);
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
            hasOrder,
            reseiptInfo,
            receiptItems,
            onAddToCart,
            onRemoveFromCart,
            onRemoveOneItem,
            onDiscountSubmit,
            onClose
        }}>
            {children}
        </FoodContext.Provider>
    );
};