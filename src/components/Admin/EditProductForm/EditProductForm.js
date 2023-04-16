
import { useEffect, useState } from 'react';
import { useError } from '../../../hooks/useError';
import { useNavigate, useParams } from 'react-router-dom';

import * as menuService from '../../../services/menuService';
import styles from './EditProductForm.module.css';

const EditProductForm = () => {

    const { error, errMsg, } = useError();
    const [editProduct, setEditSetProduct] = useState({});
    const { onHandleError } = useError();

    const { foodId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        menuService.getById(foodId)
            .then(res => {
                setEditSetProduct(res);
            });
    }, [foodId]);

    const onEditProductChangeHandler = (e) => {
        setEditSetProduct(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    let category1 = '';

    switch (editProduct.category) {
        case 'doner': category1 = 'ДЮНЕР'; break;
        case 'burger': category1 = 'БУРГЕР'; break;
        case 'pizza': category1 = 'ПИЦА'; break;
        case 'chicken': category1 = 'ПИЛЕ'; break;
        case 'falafel': category1 = 'ФАЛАФЕЛ'; break;
        case 'souces': category1 = 'ГАРНИТУРИ И СОСОВЕ'; break;
        case 'drinks': category1 = 'НАПИТКИ'; break;
        case 'kids': category1 = 'ДЕТСКО МЕНЮ'; break;
        default: category1 = ''; break;
    };

    const onEditProductSubmitHandler = (e) => {
        e.preventDefault();

        if (editProduct.title === '' || editProduct.imageUrl === '' || editProduct.price === '' || editProduct.content === '') {
            onHandleError('ВСИЧКИ ПОЛЕТА СА ЗАДЪЛЖИТЕЛНИ');
            return;
        };

        if (editProduct.title.length < 3 ) {
            onHandleError('ИМЕТО НА ПРОДУКТА ТРЯБВА ДА СЪДЪРЖА МИНИМУМ 3 СИМВОЛА');
            return;
        };

        if (editProduct.price === 0) {
            onHandleError('ЦЕНАТА ТРЯБВА ДА Е ПО ГОЛЯМА ОТ НУЛА!');
            return;
        };

        let [priceLv, priceSt] = Number(editProduct.price).toFixed(2).split('.');
        let content = [];

        if (editProduct.content.includes(',')) {
            let items = editProduct.content.split(',');
            items.forEach(i => content.push(i.trim()));
        } else {
            content.push(editProduct.content);
        };


        menuService.edit(foodId, { ...editProduct, priceLv: priceLv + '.', priceSt, content, category1 });
        navigate('/admin');
    };


    return (
        <>
            <section className={styles['bg']}>
                <div className={styles['product']}>

                    <form className={styles['product-form']} onSubmit={onEditProductSubmitHandler}>
                        {error && <p className={styles['error-msg']}>{errMsg}</p>}
                        <div>
                            <label htmlFor="title">Име на продукта</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="title"
                                name="title"
                                value={editProduct.title}
                                onChange={onEditProductChangeHandler}
                            />
                        </div>
                        <div>
                            <label htmlFor="image">Снимка</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={editProduct.imageUrl}
                                onChange={onEditProductChangeHandler}
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Цена в лева</label>
                            <input className={styles['form-control']}
                                type="number"
                                step='0.01'
                                id="price"
                                name="price"
                                value={editProduct.price}
                                onChange={onEditProductChangeHandler}
                            />
                        </div>

                        <div>
                            <label htmlFor="content">Съставки</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="content"
                                name="content"
                                placeholder='домати, краставици, лук ...'
                                value={editProduct.content}
                                onChange={onEditProductChangeHandler}
                            />
                        </div>
                        <p className={styles['important-msg']}>*След всяка съставка постави запетая!!!</p>
                        <div>
                            <label htmlFor="category">Категория</label>
                            <select className={styles['form-control']}
                                type="text"
                                id="category"
                                name="category"
                                value={editProduct.category}
                                onChange={onEditProductChangeHandler}
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

export default EditProductForm;