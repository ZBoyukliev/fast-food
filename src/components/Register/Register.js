import styles from './Register.module.css';

const Register = () => {
    return (
        <section className={styles['bg']}>
        <div className={styles['register']}>
            <div className={styles['title']}>
                <h3>РЕГИСТРАЦИЯ</h3>
            </div>
            <form className={styles['register-form']}>
                <div>
                    <label htmlFor="email">Вашият e-mail</label>
                    <input className={styles['form-control']} type="email" id="email" name="email" />
                </div>
                <div>
                    <label htmlFor="password">Парола</label>
                    <input className={styles['form-control']} type="password" id="password" name="password" />

                </div>
                <div>
                    <label htmlFor="re-password">Повтори Парола</label>
                    <input className={styles['form-control']} type="password" id="re-password" name="re-password" />

                </div>
                <div className={styles['buttons']}>
                    <input className={styles['confrim']} type="submit" value="&#10003; ПОТВЪРДИ" />
                    <input className={styles['clear']} type="submit" value="&#10008; ИЗЧИСТИ" />
                </div>
            </form>
            <p>Ако имате регистрация натиснете <a href="/login">тук</a>.</p>
        </div>
    </section>
    );
};

export default Register;