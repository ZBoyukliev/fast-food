import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

import * as menuService from '../../../services/menuService';
import styles from './CreateProductForm.module.css';
import { useError } from '../../../hooks/useError';

const CreateProductForm = () => {

    const navigate = useNavigate();
    const { error, errMsg, onHandleError } = useError();

    const { values, onChangeHandler } = useForm({
        title: '',
        imageUrl: '',
        price: 0,
        content: '',
        category: 'doner',
    });

    let category1 = '';

    switch (values.category) {
        case 'doner': category1 = 'ДЮНЕР'; break;
        case 'burger': category1 = 'БУРГЕР'; break;
        case 'pizza': category1 = 'ПИЦА'; break;
        case 'chicken': category1 = 'ПИЛЕ'; break;
        case 'falafel': category1 = 'ФАЛАФЕЛ'; break;
        case 'souces': category1 = 'ГАРНИТУРИ И СОСОВЕ'; break;
        case 'drinks': category1 = 'НАПИТКИ'; break;
        case 'kids': category1 = 'ДЕТСКО МЕНЮ'; break;
        default: category1 = ''; break;
    }

    const onProductSubmit = (e) => {
        e.preventDefault();

        if (values.title === '' || values.imageUrl === '' || values.price === '' || values.content === '') {
            onHandleError('ВСИЧКИ ПОЛЕТА СА ЗАДЪЛЖИТЕЛНИ');
            return;
        };

        if (values.title.length < 3 ) {
            onHandleError('ИМЕТО НА ПРОДУКТА ТРЯБВА ДА СЪДЪРЖА МИНИМУМ 3 СИМВОЛА');
            return;
        };

        if (values.price === 0) {
            onHandleError('ЦЕНАТА ТРЯБВА ДА Е ПО ГОЛЯМА ОТ НУЛА!');
            return;
        };

        let [priceLv, priceSt] = Number(values.price).toFixed(2).split('.');
        let content = [];

        if (values.content.includes(',')) {
            let items = values.content.split(',');
            items.forEach(i => content.push(i.trim()));
        } else {
            content.push(values.content);
        };

        menuService.create({ ...values, priceLv: priceLv + '.', priceSt, content, category1 });
        navigate('/admin');
    };

    return (
        <>
            <section className={styles['bg']}>
                <div className={styles['product']}>

                    <form className={styles['product-form']} onSubmit={onProductSubmit}>
                        {error && <p className={styles['error-msg']}>{errMsg}</p>}
                        <div>
                            <label htmlFor="title">Име на продукта</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="title"
                                name="title"
                                value={values.title}
                                onChange={onChangeHandler}
                            />
                        </div>
                        <div>
                            <label htmlFor="image">Снимка</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={values.imageUrl}
                                onChange={onChangeHandler}
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Цена в лева</label>
                            <input className={styles['form-control']}
                                type="number"
                                step='0.01'
                                id="price"
                                name="price"
                                value={values.price}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div>
                            <label htmlFor="content">Съставки</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="content"
                                name="content"
                                placeholder='домати, краставици, лук ...'
                                value={values.content}
                                onChange={onChangeHandler}
                            />
                        </div>
                        <p className={styles['important-msg']}>*След всяка съставка постави запетая!!!</p>
                        <div>
                            <label htmlFor="category">Категория</label>
                            <select className={styles['form-control']}
                                type="text"
                                id="category"
                                name="category"
                                value={values.category}
                                onChange={onChangeHandler}
                            >
                                <option value='doner'>дюнер</option>
                                <option value='pizza'>пица</option>
                                <option value='burger'>бургер</option>
                                <option value='chicken'>пиле</option>
                                <option value='falafel'>фалафел</option>
                                <option value='souces'>гарнитури и сосове</option>
                                <option value='drinks'>напитки</option>
                                <option value='deserts'>десерти</option>
                                <option value='kids'>детско меню</option>
                            </select>
                        </div>

                        <div className={styles['buttons']}>
                            <input className={styles['confrim']} type="submit" value="&#10003; ДОБАВИ" />
                            {/* <input className={styles['clear']} type="button" value="&#10008; ИЗЧИСТИ" /> */}
                        </div>
                    </form>

                </div>
            </section>
        </>
    );
};

export default CreateProductForm;