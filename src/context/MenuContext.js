import { createContext, useEffect, useState } from 'react';
import * as menuService from '../services/menuService';
export const MenuContext = createContext();

export const MenuProvider = ({
    children
}) => {

    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        menuService.getAll()
            .then(res => {
                setProduct(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setErr(true);
                setProduct([]);
            });
        
    }, []);

    const onCreateProductHandler = (newProduct) => {
        setProduct(state => [...state, newProduct]);
    };

    const onEditProductHandler = (updatedProduct, productId) => {
        setProduct(state => state.map(p => p._id === productId ? updatedProduct : p));
    };

    const onDeleteProductHandler = (foodId) => {
        setProduct(state => state.filter(x => x._id !== foodId));
    };

    return (
        <MenuContext.Provider value={{
            product,
            isLoading,
            err,
            onCreateProductHandler,
            onDeleteProductHandler,
            onEditProductHandler
        }}>
            {children}
        </MenuContext.Provider>
    );
};
