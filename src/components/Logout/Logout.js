import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import * as authService from '../../services/authService';



export const Logout = () => {
    const navigate = useNavigate();
    const { user, userLogout } = useContext(AuthContext);

    useEffect(() => {
        authService.logout(user.accessToken)
            .then(() => {
                userLogout();
                navigate('/');
            })
            .catch(() => {
                navigate('/');
            });
    }, [user.accessToken, navigate, userLogout]);

    return null;
};