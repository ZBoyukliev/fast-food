import styles from './AddressForm.module.css';
 
const AddressForm = () => {
    return (<>
        <h3 className={styles['address-title']}>Адрес за доставка</h3>
        <form className={styles['address-from']}>
            <div className={styles['firstname']}>
                <label htmlFor="firstname">Име</label>
                <input type="firstname" id="firstname" name="firstname" />
            </div>
            <div className={styles['surename']}>
                <label htmlFor="surename">Фамилия</label>
                <input type="text" id="surename" name="surename" />
            </div>
            <div className={styles['phonenumber']}>
                <label htmlFor="phonenumber">Телефон</label>
                <input type="text" id="phonenumber" name="phonenumber" />
            </div>
            <div className={styles['town']}>
                <label htmlFor="town">Град</label>
                <input type="text" id="town" name="town" />
            </div>
            <div className={styles['address']}>
                <label htmlFor="address">Адрес</label>
                <input type="text" id="address" name="address" />
            </div>
            <input className={styles['order-btn']} type="submit" value="ПОРЪЧАЙ" />
        </form>
    </>
    );
};
 
export default AddressForm;
