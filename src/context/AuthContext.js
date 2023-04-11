import { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();


export const AuthProvider = ({
    children
}) => {

    const [auth, setAuth] = useLocalStorage('auth', {});

    const userLogin = (authData) => {
        setAuth({
            accessToken: authData.accessToken,
            email: authData.email,
            userId: authData._id,
            ownerId: authData._ownerId,
            isAuthenticated: !!authData.accessToken,
            admin: authData.admin || false
        });
    };

    const userLogout = () => {
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{ user: auth, userLogin, userLogout }}>
            {children}
        </AuthContext.Provider>
    );
};