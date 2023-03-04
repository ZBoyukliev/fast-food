import styles from './Login.module.css';

const Login = () => {
    return (
        <section className={styles['bg']}>
            <div className={styles['login']}>
                <div className={styles['title']}>
                    <h3>ВХОД</h3>
                </div>
                <form className={styles['login-form']}>
                    <div>
                        <label htmlFor="email">Вашият e-mail</label>
                        <input className={styles['form-control']} type="email" id="email" name="email" />
                    </div>
                    <div>
                        <label htmlFor="password">Парола</label>
                        <input className={styles['form-control']} type="password" id="password" name="password" />

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