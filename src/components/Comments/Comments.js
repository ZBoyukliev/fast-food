import { useContext, useEffect } from 'react';
import { useState } from 'react';
import styles from './Comments.module.css';
import * as commentsService from '../../services/commentsService';
import { AuthContext } from '../context/AuthContext';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const { user } = useContext(AuthContext);
    const [review, setReview] = useState({ username: '', image: '', comment: '' });

    useEffect(() => {
        commentsService.getAllComments()
            .then(result => {
                setComments(result);
            });
    }, []);

    const onChangeHandler = (e) => {
        setReview(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        let result = await commentsService.postComment(user.userId, review.comment, review.username, review.image);
        setComments(state => [...state, result]);
        setReview({ username: '', image: '', comment: '' });
        console.log(result);
    };

    const onDeleteHandler = (id) => {
        commentsService.removeCommment(id);
        setComments(state => state.filter(x => x._id !== id));
        // window.confirm('Сгурен ли си че искаш да изтриеш твоето ревю ?');

    };

    return (
        // {() => onDeleteHandler(c._id)}
        <main className={styles['main']}>

            <section className={styles['comment']}>
                <h3 className={styles['comment-title1']}>ВАШИТЕ ОТЗИВИ СА ВАЖНИ ЗА НАС</h3>

                <div className={styles['comment-sec']}>
                    {comments.map(c => (
                        <div key={c._id} className={styles['comment-sec-product']}>
                            <h3 className={styles['comment-sec-title']}><span> </span>{c.username}</h3>
                            <div className={styles['img']}>
                                <img src={c.imageUrl} alt='meal' />
                            </div>
                            <div className={styles['comment-content']}>
                                <p className={styles['comment-content-p']}> {c.comment}</p>
                            </div>
                            {c._ownerId === user.userId && <div className={styles['div-btn']}>
                                <button className={styles['edit-btn']}>&#9998; Редактирай</button>
                                <button className={styles['delete-btn']} onClick={() => { window.confirm( 'Сигурни ли сте че искате да изтриете ревюто си ?') &&  onDeleteHandler(c._id); }} >&#10008; Изтрий</button>
                            </div>}

                        </div>
                    ))}

                </div>
                <h2 className={styles['comment-title2']}><i className="fa-solid fa-circle-arrow-down"></i> Остави твоя коментар тук <i className="fa-solid fa-circle-arrow-down"></i></h2>
                <form className={styles['comments-form']} onSubmit={onSubmitHandler}>
                    <div className={styles['username']}>
                        <label htmlFor="username">Псевдоним</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={review.username}
                            onChange={onChangeHandler}
                        />
                    </div>
                    <div className={styles['image']}>
                        <label htmlFor="image">Снимка</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={review.image}
                            onChange={onChangeHandler}
                        />
                    </div>
                    <div className={styles['comment-text']}>
                        <label htmlFor="comment">Коментар</label>
                        <textarea
                            type="text"
                            id="comment"
                            name="comment"
                            rows={4}
                            value={review.comment}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <input className={styles['add-btn']} type="submit" value="Добави коментар" />
                </form>
            </section>


        </main>

    );
};

export default Comments;