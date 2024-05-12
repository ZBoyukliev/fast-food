import { FoodContext } from '../../../context/FoodContext';
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { useError } from '../../../hooks/useError';
import styles from './AddressForm.module.css';

const AddressForm = () => {

    const { onDiscountSubmit } = useContext(FoodContext);
    const { user } = useContext(AuthContext);
    const { error, errMsg, onHandleError } = useError();

    const [errors, setErrors] = useState({});


    const { values, onChangeHandler } = useForm({
        firstname: '',
        surename: '',
        phonenumber: '',
        email: user.email,
        town: '',
        address: '',
        code: ''
    });


    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const validatePhoneNumber = (phonenumber) => {
        const regex = /08[7|8|9][0-9]{7}$/i;
        return regex.test(phonenumber);
    };

    const onBlurHandler = (event) => {
        const { name, value } = event.target;
        let error = null;

        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    error = 'невалиден имейл';
                }
                break;
            case 'town':
                if (value.trim() === '') {
                    error = 'веведи град';
                }
                break;
            case 'address':
                if (value.trim() === '') {
                    error = 'виведи адрес';
                }
                break;
            case 'firstname':
                if (value.trim() === '') {
                    error = 'виведи име';
                }
                break;
            case 'surename':
                if (value.trim() === '') {
                    error = 'въведи фамилия';
                }
                break;
            case 'phonenumber':
                if (!validatePhoneNumber(value)) {
                    error = 'невалиден телефонен номер';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onDiscount = (e) => {

        if (values.name === '' || values.surename === '' || values.address === '' || values.phonenumber === '' || values.town === '' || values.email === '') {
            e.preventDefault();
            onHandleError('всички полета със звездичка са задължителни!');
            return;
        };

        onDiscountSubmit(e, values);
    };

    return (
        <>
            <h3 className={styles['address-title']}>Адрес за доставка</h3>
            {error && <p className={styles['error-msg']}>{errMsg}</p>}
            <form onSubmit={onDiscount} className={styles['address-from']}>
                <div className={styles['firstname']}>
                    <label htmlFor="firstname">Име*</label>
                    <input
                        type="firstname"
                        id="firstname"
                        name="firstname"
                        value={values.firstname}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.firstname && <span style={{ color: 'red' }}>{errors.firstname}</span>}
                </div>
                <div className={styles['surename']}>
                    <label htmlFor="surename">Фамилия*</label>
                    <input
                        type="text"
                        id="surename"
                        name="surename"
                        value={values.surename}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.surename && <span style={{ color: 'red' }}>{errors.surename}</span>}
                </div>
                <div className={styles['phonenumber']}>
                    <label htmlFor="phonenumber">Телефон*</label>
                    <input
                        type="text"
                        id="phonenumber"
                        name="phonenumber"
                        value={values.phonenumber}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.phonenumber && <span style={{ color: 'red' }}>{errors.phonenumber}</span>}
                </div>
                <div className={styles['email']}>
                    <label htmlFor="email">email*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                </div>
                <div className={styles['town']}>
                    <label htmlFor="town">Град*</label>
                    <input
                        type="text"
                        id="town"
                        name="town"
                        value={values.town}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.town && <span style={{ color: 'red' }}>{errors.town}</span>}
                </div>
                <div className={styles['address']}>
                    <label htmlFor="address">Адрес*</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={values.address}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                    {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
                </div>
                <div className={styles['code']}>
                    <label htmlFor="code">Код за отстъпка</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={values.code}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                    />
                </div>

                <input className={styles['order-btn']} type="submit" value="ПОРЪЧАЙ" />
            </form>
        </>
    );
};

export default AddressForm;
