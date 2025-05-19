import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

export const RouteGuard = ({
    children,
}) => {
    const { user } = useContext(AuthContext);
    if (user.email) {
        return <Navigate to="/" />;
    }
    return children ? children : <Outlet />;
};
