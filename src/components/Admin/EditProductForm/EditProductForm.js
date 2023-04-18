
import { useContext, useEffect, useState } from 'react';
import { useError } from '../../../hooks/useError';
import { useNavigate, useParams } from 'react-router-dom';

import * as menuService from '../../../services/menuService';
import styles from './EditProductForm.module.css';
import { MenuContext } from '../../../context/MenuContext';

const EditProductForm = () => {

    const [editProduct, setEditSetProduct] = useState({});
    const { error, errMsg, onHandleError } = useError();
    const [errors, setErrors] = useState({});
    const { product, onEditProductHandler } = useContext(MenuContext);

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

    const onBlurHandler = (e) => {
        const { name, value } = e.target;
        let error = null;

        switch (name) {
            case 'title':
                if (value.trim() === '') {
                    error = 'въведи продукт';
                }
                else if (product.find(p => (p.title.toLowerCase() === value.toLowerCase() && p._id !== foodId))) {
                    error = 'името вече е налично, моля избери друго име';
                }
                break;
            case 'imageUrl':
                if (value.trim() === '') {
                    error = 'виведи снимка';
                }
                break;
            case 'price':
                if (Number(value) < 0.1) {
                    error = 'виведи цена по голяма от нула';
                }
                break;
            case 'content':
                if (value.trim() === '') {
                    error = 'въведи съставки или грамаж ';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

    const onEditProductSubmitHandler = (e) => {
        e.preventDefault();

        if (editProduct.title === '' || editProduct.imageUrl === '' || editProduct.price === '' || editProduct.content === '') {
            onHandleError('ВСИЧКИ ПОЛЕТА СА ЗАДЪЛЖИТЕЛНИ');
            return;
        };

        if (Number(editProduct.price) < 0.1) {
            onHandleError('виведи цена по голяма от нула');
            return;
        }

        let [priceLv, priceSt] = Number(editProduct.price).toFixed(2).split('.');
        let content = [];

        if (editProduct.content.includes(',')) {
            let items = editProduct.content.split(',');
            items.forEach(i => content.push(i.trim()));
        } else {
            content.push(editProduct.content);
        };


        menuService.edit(foodId, { ...editProduct, priceLv: priceLv + '.', priceSt, content, category1 })
            .then(res => {
                onEditProductHandler(res, foodId);
                console.log(res);
            });
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
                                onBlur={onBlurHandler}
                            />
                        </div>
                        {errors.title && <span className={styles['span-error']}>{errors.title}</span>}
                        <div>
                            <label htmlFor="imageUrl">Снимка</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={editProduct.imageUrl}
                                onChange={onEditProductChangeHandler}
                                onBlur={onBlurHandler}
                            />
                        </div>
                        {errors.imageUrl && <span className={styles['span-error']}>{errors.imageUrl}</span>}
                        <div>
                            <label htmlFor="price">Цена в лева</label>
                            <input className={styles['form-control']}
                                type="number"
                                step='0.01'
                                id="price"
                                name="price"
                                value={editProduct.price}
                                onChange={onEditProductChangeHandler}
                                onBlur={onBlurHandler}
                            />
                        </div>
                        {errors.price && <span className={styles['span-error']}>{errors.price}</span>}

                        <div>
                            <label htmlFor="content">Съставки</label>
                            <input className={styles['form-control']}
                                type="text"
                                id="content"
                                name="content"
                                placeholder='домати, краставици, лук ...'
                                value={editProduct.content}
                                onChange={onEditProductChangeHandler}
                                onBlur={onBlurHandler}
                            />
                        </div>
                        {errors.content && <span className={styles['span-error']}>{errors.content}</span>}
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
                            <input className={styles['confrim']} type="submit" value="&#10003; РЕДАКТИРАЙ" />
                        </div>
                    </form>

                </div>
            </section>
        </>
    );
};

export default EditProductForm;