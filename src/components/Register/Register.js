import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Register.module.css';
import * as authService from '../../services/authService';

const Register = () => {

    const [userData, setUserData] = useState({ email: '', password: '', repass: '' });
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onChangeHandler = (e) => {
        setUserData(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const { email, password, repass } = userData;

        if (password !== repass) {
            setError(true);
            setErrorMsg('passwords dont match');
            setTimeout(() => {
                setError(false);
            }, 3000);
            return;
        };

        if(email === '' || password === '' || repass === '') {
            setError(true);
            setErrorMsg('all fields are required');
            setTimeout(() => {
                setError(false);
            }, 3000);
            return;
        };
        
        authService.register(email, password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            });
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
                    <div>
                        <label htmlFor="repass">Повтори Парола</label>
                        <input className={styles['form-control']}
                            type="password"
                            id="re-password"
                            name="repass"
                            value={userData.repass}
                            onChange={onChangeHandler} />

                    </div>
                    {error && <p className={styles['error-msg']}>{errorMsg}</p>}
                    <div className={styles['buttons']}>
                        <input className={styles['confrim']} type="submit" value="&#10003; ПОТВЪРДИ" />
                        <input className={styles['clear']} type="submit" value="&#10008; ИЗЧИСТИ" />
                    </div>
                </form>
                <p>Ако имате регистрация натиснете <Link to="/login">тук</Link>.</p>
            </div>
        </section>
    );
};

export default Register;