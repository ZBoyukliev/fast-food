
import { useNavigate } from 'react-router-dom';
import { createContext, useState } from 'react';

import * as menuService from '../services/menuService';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {

    const [searchFood, setSearchFood] = useState([]);
    const navigate = useNavigate();

    const onSearch = async (e, search) => {
        e.preventDefault();

        const foodName = search.search;
        const result = await menuService.searchFood(foodName);

        setSearchFood(result);
        navigate('/search');
    };

    return (
        <SearchContext.Provider value={{ onSearch, searchFood }}>
            {children}
        </SearchContext.Provider>
    );
};
