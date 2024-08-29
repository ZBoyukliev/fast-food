import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

export const AdminGuard = ({
    children,
}) => {
    const { user } = useContext(AuthContext);
    
    if (!user.admin) {
        return <Navigate to="/" />;
    }
    return children ? children : <Outlet />;
};
