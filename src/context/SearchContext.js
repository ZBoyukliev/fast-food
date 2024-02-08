import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as menuService from '../services/menuService';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {

    const [searchFood, setSearchFood] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const onSearch = async (e, foodName) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await menuService.searchFood(foodName);

        setSearchFood(result);
        navigate('/search');
        setIsLoading(false);
    };

    return (
        <SearchContext.Provider value={{ onSearch, searchFood, isLoading }}>
            {children}
        </SearchContext.Provider>
    );
};
