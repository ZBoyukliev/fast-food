import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useError } from '../../hooks/useError';
import * as authService from '../../services/authService';
import styles from './Register.module.css';

const Register = () => {

    const { error, errMsg, onHandleError } = useError();
    const [errors, setErrors] = useState({});
    const { values, onChangeHandler, changeValues } = useForm({
        email: '',
        password: '',
        repass: ''
    });

    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const onBlurHandler = (event) => {
        const { name, value } = event.target;
        let error = null;

        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    error = 'invalid email';
                }
                break;
            case 'password':
                if (value.length < 6 || value.length > 20) {
                    error = 'Your password must be between 6 and 20 characters!';
                } else if (value.search(/[a-z][A-Z]/i) < 0) {
                    error = 'password should contain atleast one lowercase letter and one uppercase letter';
                }
                 else if (value.search(/[0-9]/i) < 0) {
                    error = 'password should contain atleast one digit';
                }
                break;
            case 'repass':
                if (value.length < 6 || value.length > 20) {
                    error = 'Your password must be between 6 and 20 characters!';
                } else if (value.search(/[a-z][A-Z]/i) < 0) {
                    error = 'password should contain atleast one lowercase letter and one uppercase letter';
                }
                 else if (value.search(/[0-9]/i) < 0) {
                    error = 'password should contain atleast one digit';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const { email, password, repass } = values;

        if (password !== repass) {
            onHandleError('Passwords don`t match!');
            return;
        };

        if(errors.email || errors.password || errors.repass) {
            return;
        }

        authService.register(email, password)
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
                    <div className={styles['div-form']}>
                        <label htmlFor="email">Вашият e-mail</label>
                        <input className={styles['form-control']}
                            type="email"
                            id="email"
                            name="email"
                            value={values.email}
                            onChange={onChangeHandler}
                            onBlur={onBlurHandler}
                        />
                    </div>
                    {errors.email && <span className={styles['span-error']}>{errors.email}</span>}
                    <div className={styles['div-form']}>
                        <label htmlFor="password">Парола</label>
                        <input className={styles['form-control']}
                            type="password"
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={onChangeHandler}
                            onBlur={onBlurHandler}
                        />
                    </div>
                    {errors.password && <span className={styles['span-error']}>{errors.password}</span>}
                    <div className={styles['div-form']}>
                        <label htmlFor="repass">Повтори Парола</label>
                        <input className={styles['form-control']}
                            type="password"
                            id="repass"
                            name="repass"
                            value={values.repass}
                            onChange={onChangeHandler}
                            onBlur={onBlurHandler}
                        />
                    </div>
                    {errors.repass && <span className={styles['span-error']}>{errors.repass}</span>}
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
