import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

import * as menuService from '../../../services/menuService';
import styles from './CreateProductForm.module.css';

const CreateProductForm = () => {

    const navigate = useNavigate();

    const { values, onChangeHandler } = useForm({
        title: '',
        imageUrl: '',
        price: '',
        contents: '',
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
        let [priceLv, priceSt] = Number(values.price).toFixed(2).split('.');
        let content = [];
        content.push(values.contents);

        menuService.create({ ...values, priceLv: priceLv + '.', priceSt, content, category1 });
        console.log(values);
        navigate('/admin');
    };

    return (
        <>
            <section className={styles['bg']}>
                <div className={styles['product']}>

                    <form className={styles['product-form']} onSubmit={onProductSubmit}>
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
                                value={values.image}
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
                                id="contents"
                                name="contents"
                                value={values.contents}
                                onChange={onChangeHandler}
                            />
                        </div>
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
                            <input className={styles['clear']} type="button" value="&#10008; ИЗЧИСТИ" />
                        </div>
                    </form>

                </div>
            </section>
        </>
    );
};

export default CreateProductForm;