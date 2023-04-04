import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import * as authService from '../../services/authService';
import styles from './Login.module.css';
import { useForm } from '../../hooks/useForm';
import { useError } from '../../hooks/useError';

const Login = () => {

    const {
        error,
        errMsg,
        onHandleError
    } = useError();

    const { values, onChangeHandler, changeValues } = useForm({
        email: '',
        password: ''
    });

    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = values;

        authService.login(email, password)
            .then(authData => {
                userLogin(authData);
                navigate(-1);
            })
            .catch((error) => {
                onHandleError(error.message);
                return;
            });
    };

    const onClearHandler = () => {
        changeValues({ email: '', password: '' });
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
                            value={values.email}
                            onChange={onChangeHandler} />
                    </div>
                    <div>
                        <label htmlFor="password">Парола</label>
                        <input className={styles['form-control']}
                            type="password"
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={onChangeHandler} />

                    </div>
                    {error && <p className={styles['error-msg']}>{errMsg}</p>}
                    <div className={styles['buttons']}>
                        <input className={styles['confrim']} type="submit" value="&#10003; ПОТВЪРДИ" />
                        <input onClick={onClearHandler} className={styles['clear']} type="button" value="&#10008; ИЗЧИСТИ" />
                    </div>
                </form>
                <p>Ако нямате регистрация може да си направите от <Link to="/register">тук</Link>.</p>
            </div>
        </section>
    );
};

export default Login;