import styles from './Login.module.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import * as authService from '../../services/authService';

const Login = () => {

    const [userData, setUserData] = useState({ email: '', password: '' });

    const onChangeHandler = (e) => {
        setUserData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        const { email, password } = userData;
        e.preventDefault();
        authService.login(email, password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            });
    };

    return (
        <section className={styles['bg']}>
            <div className={styles['login']}>
                <div className={styles['title']}>
                    <h3>ВХОД</h3>
                </div>
                <form className={styles['login-form']} onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email">Вашият e-mail</label>
                        <input className={styles['form-control']}
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={onChangeHandler} />
                    </div>
                    <div>
                        <label htmlFor="password">Парола</label>
                        <input className={styles['form-control']}
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={onChangeHandler} />

                    </div>
                    <div className={styles['buttons']}>
                        <input className={styles['confrim']} type="submit" value="&#10003; ПОТВЪРДИ" />
                        <input className={styles['clear']} type="submit" value="&#10008; ИЗЧИСТИ" />
                    </div>
                </form>
                <p>Ако нямате регистрация може да си направите от <a href="/register">тук</a>.</p>
            </div>
        </section>
    );
};

export default Login;