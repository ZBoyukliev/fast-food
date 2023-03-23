import { useEffect } from 'react';
import { useState } from 'react';
import styles from './Comments.module.css';
import * as commentsService from '../../services/commentsService';


const Comments = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        commentsService.getAllComments()
            .then(result => {
                console.log(result);
                setComments(result);
            });
    }, []);


    return (

        <main className={styles['main']}>

            <section className={styles['comment']}>
                <h3 className={styles['comment-title1']}>ВАШИТЕ ОТЗИВИ СА ВАЖНИ ЗА НАС</h3>

                <div className={styles['comment-sec']}>
                    {comments.map(c => (
                        <div className={styles['comment-sec-product']}>
                            <h3 className={styles['comment-sec-title']}><span> </span>{c.username}</h3>
                            <div className={styles['img']}>
                                <img src={c.imageUrl} alt='meal' />
                            </div>
                            <div className={styles['comment-content']}>
                                <p className={styles['comment-content-p']}> {c.comment}</p>
                            </div>
                            <div className={styles['div-btn']}>
                                <button className={styles['edit-btn']}>&#9998; Редактирай</button>
                                <button className={styles['delete-btn']}>&#10008; Изтрий</button>
                            </div>
                        </div>
                    ))}

                </div>
                <h2 className={styles['comment-title2']}><i class="fa-solid fa-circle-arrow-down"></i> Остави твоя коментар тук <i class="fa-solid fa-circle-arrow-down"></i></h2>
                <form className={styles['comments-form']}>
                    <div className={styles['username']}>
                        <label htmlFor="username">Псевдоним</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                        />
                    </div>
                    <div className={styles['image']}>
                        <label htmlFor="image">Снимка</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                        />
                    </div>
                    <div className={styles['comment-text']}>
                        <label htmlFor="comment">Коментар</label>
                        <textarea
                            type="text"
                            id="comment"
                            name="comment"
                            rows={4}
                        />
                    </div>

                    <input className={styles['add-btn']} type="submit" value="Добави коментар" />
                </form>
            </section>


        </main>

    );
};

export default Comments;