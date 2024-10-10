import { useContext, useEffect, useState } from 'react';
import { useError } from '../../../hooks/useError';
import { useNavigate, useParams } from 'react-router-dom';
import * as menuService from '../../../services/menuService';
import styles from './EditProductForm.module.css';
import { MenuContext } from '../../../context/MenuContext';

const EditProductForm = () => {

    const [editProduct, setEditProduct] = useState({});
    const { error, errMsg, onHandleError } = useError();
    const [errors, setErrors] = useState({});
    const { product, onEditProductHandler } = useContext(MenuContext);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const { foodId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        menuService.getById(foodId)
            .then(res => {
                setEditProduct(res);
                setTitle(res.title);
                setPrice(res.price);
                setImageUrl(res.imageUrl);
                setContent(res.content.join(', '));
                setCategory(res.category);
            });
    }, [foodId]);

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

        if(errors.title || errors.imageUrl || errors.content || errors.category || errors.price) {
            return;
        }

        if (Number(editProduct.price) < 0.1) {
            onHandleError('виведи цена по голяма от нула');
            return;
        }

        let contentArray = content ? content.split(',').map((c) => c.trim()) : content;
        let [priceLv, priceSt] = Number(price).toFixed(2).split('.');
        let category1 = '';
 
        switch (category) {
            case 'doner': category1 = 'ДЮНЕР'; break;
            case 'burger': category1 = 'БУРГЕР'; break;
            case 'pizza': category1 = 'ПИЦА'; break;
            case 'chicken': category1 = 'ПИЛЕ'; break;
            case 'falafel': category1 = 'ФАЛАФЕЛ'; break;
            case 'souces': category1 = 'ГАРНИТУРИ И СОСОВЕ'; break;
            case 'drinks': category1 = 'НАПИТКИ'; break;
            case 'kids': category1 = 'ДЕТСКО МЕНЮ'; break;
            default: break;
        };
 
        const updatedValues = {
            ...editProduct,
            title,
            imageUrl,
            price: Number(price),
            category,
            category1,
            content: contentArray,
            priceLv: priceLv + '.',
            priceSt,
        };

        menuService.edit(foodId, updatedValues)
            .then(res => {
                onEditProductHandler(res, foodId);
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
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
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
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
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
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
