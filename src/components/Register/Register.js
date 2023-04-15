import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '../../hooks/useForm';
import { useError } from '../../hooks/useError';

import * as authService from '../../services/authService';
import styles from './Register.module.css';

const Register = () => {

    const {
        error,
        errMsg,
        onHandleError
    } = useError();

    const { values, onChangeHandler, changeValues } = useForm({
        email: '',
        password: '',
        repass: ''
    });

    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const { email, password, repass } = values;

        if (password.length < 6 || password.length > 12) {
            onHandleError('Your password must be between 6 and 12 characters!');
            return;
        }
 
        if (password.search(/[a-z][A-Z]/i) < 0){
            onHandleError('password should contain atleast one lowercase letter and one uppercase letter');
            return ;
        }
 
        if (password.search(/[0-9]/i) < 0){
            onHandleError('password should contain atleast one digit');
            return ;
        }
 
        if (password !== repass) {
            onHandleError('Passwords don`t match!');
            return;
        }
    
        authService.register(email, password, repass)
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
        changeValues({ email: '', password: '', repass: '' });
    };

    return (
        <section className={styles['bg']}>
            <div className={styles['register']}>
                <div className={styles['title']}>
                    <h3>РЕГИСТРАЦИЯ</h3>
                </div>
                <form className={styles['register-form']} onSubmit={onSubmit}>
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
                    <div>
                        <label htmlFor="repass">Повтори Парола</label>
                        <input className={styles['form-control']}
                            type="password"
                            id="re-password"
                            name="repass"
                            value={values.repass}
                            onChange={onChangeHandler} />

                    </div>
                    {error && <p className={styles['error-msg']}>{errMsg}</p>}
                    <div className={styles['buttons']}>
                        <input className={styles['confrim']} type="submit" value="&#10003; ПОТВЪРДИ" />
                        <input onClick={onClearHandler} className={styles['clear']} type="button" value="&#10008; ИЗЧИСТИ" />
                    </div>
                </form>
                <p>Ако имате регистрация натиснете <Link to="/login">тук</Link>.</p>
            </div>
        </section>
    );
};

export default Register;