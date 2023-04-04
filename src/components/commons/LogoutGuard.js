import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

export const LogoutGuard = ({
    children,
}) => {
    const { user } = useContext(AuthContext);
    
    if (!user.email) {
        return <Navigate to="/login" />;
    }

    return children ? children : <Outlet />;
};