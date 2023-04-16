import { FoodContext } from '../../../context/FoodContext';
import { AuthContext } from '../../../context/AuthContext';
import { useContext } from 'react';

import { useForm } from '../../../hooks/useForm';
import { useError } from '../../../hooks/useError';

import styles from './AddressForm.module.css';

const AddressForm = () => {

    const { onDiscountSubmit } = useContext(FoodContext);
    const { user } = useContext(AuthContext);

    const { error, errMsg, onHandleError } = useError();

    const { values, onChangeHandler } = useForm({
        firstname: '',
        surename: '',
        phonenumber: '',
        email: user.email,
        towm: '',
        address: '',
        code: ''
    });

    const onDiscount = (e) => {

        if (values.firstname === '' || values.surename === '' || values.phonenumber === '' || values.email === '' || values.town === '' || values.address === '') {
            e.preventDefault();
            onHandleError('ВСИЧКИ ИПОЛЕТА СЪС ЗВЕЗДИЧКА СА ЗАДЪЛЖИТЕЛНИ!');
            return;
        };

        if(values.firstname.length < 2 || values.surename.length < 2 || values.town.length < 2) {
            e.preventDefault();
            onHandleError('ИМЕ, ФАМИЛИЯ И ГРАД ТРЯБВА ДА СЪДЪРЖАТ МИНИМУМ 2 СИМВОЛА!');
            return;
        }

        if(values.address.length < 3 ) {
            e.preventDefault();
            onHandleError('АДРЕС ТРЯБВА ДА СЪДЪРЖАТ МИНИМУМ 3 СИМВОЛА!');
            return;
        }

        if(values.phonenumber.search(/08[7|8|9][0-9]{7}$/i)) {
            e.preventDefault();
            onHandleError('НЕВАЛИДЕН ТЕЛЕФОНЕН НОМЕР!');
            return;
        }
        onDiscountSubmit(e, values); 
    };

    return (
    <>
        <h3 className={styles['address-title']}>Адрес за доставка</h3>
       {error ? <p className={styles['error-msg']}>{errMsg}</p> : null} 
        <form onSubmit={onDiscount} className={styles['address-from']}>
            <div className={styles['firstname']}>
                <label htmlFor="firstname">Име*</label>
                <input
                    type="firstname"
                    id="firstname"
                    name="firstname"
                    value={values.firstname}
                    onChange={onChangeHandler} />
            </div>
            <div className={styles['surename']}>
                <label htmlFor="surename">Фамилия*</label>
                <input
                    type="text"
                    id="surename"
                    name="surename"
                    value={values.surename}
                    onChange={onChangeHandler} />
            </div>
            <div className={styles['phonenumber']}>
                <label htmlFor="phonenumber">Телефон*</label>
                <input
                    type="text"
                    id="phonenumber"
                    name="phonenumber"
                    value={values.phonenumber}
                    onChange={onChangeHandler} />
            </div>
            <div className={styles['email']}>
                <label htmlFor="email">email*</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={onChangeHandler} />
            </div>
            <div className={styles['town']}>
                <label htmlFor="town">Град*</label>
                <input
                    type="text"
                    id="town"
                    name="town"
                    value={values.town}
                    onChange={onChangeHandler} />
            </div>
            <div className={styles['address']}>
                <label htmlFor="address">Адрес*</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={onChangeHandler} />
            </div>
            <div className={styles['code']}>
                <label htmlFor="code">Код за отстъпка</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    value={values.code}
                    onChange={onChangeHandler} />
            </div>

            <input className={styles['order-btn']} type="submit" value="ПОРЪЧАЙ" />
        </form>
    </>
    );
};

export default AddressForm;
