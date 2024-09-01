import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import * as authService from '../../services/authService';
import Spinner from '../Spinner/Spinner';

export const Logout = () => {
    
    const navigate = useNavigate();
    const { user, userLogout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        authService.logout(user.accessToken)
            .then(() => {
                userLogout();
                navigate('/');
            })
            .catch(() => {
                navigate('/');
            });
        setIsLoading(true);
    }, [user.accessToken, navigate, userLogout]);

    return (isLoading ? <Spinner /> : null);
};
