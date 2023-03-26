
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import styles from './Comments.module.css';
import * as commentsService from '../../services/commentsService';
import { AuthContext } from '../context/AuthContext';

 
const Comments = () => {
    const [comments, setComments] = useState([]);
    const [editForm, setShowEditForm] = useState(false);
 
    const { user } = useContext(AuthContext);
    const [review, setReview] = useState({ username: '', imageUrl: '', comment: '' });
 
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
        let result = await commentsService.postComment(user.userId, review.comment, review.username, review.imageUrl);
        setComments(state => [...state, result]);
        setReview({ username: '', imageUrl: '', comment: '' });
        console.log(result);
    };
 
 
 
    const onDeleteHandler = (id) => {
        commentsService.removeCommment(id);
        setComments(state => state.filter(x => x._id !== id));
    };
 
 
    const [editComment, setEditComment] = useState({});
 
    const onEditHandler = async (comment) => {
        const result = await commentsService.getCommendById(comment._id);
        setEditComment(result);
        setShowEditForm(true);
    };

    const onEditChangeHandler = (e) => {
        setEditComment(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onEditSubmitHandler = async (e) => {
        e.preventDefault();
        const result = await commentsService.editComent(editComment._id, editComment);
        setComments(state => state.map(c => c._id === editComment._id ? result : c));
 
        setShowEditForm(false);
    };
 
 
    return (
 
        <main className={styles['main']}>
 
            <section className={styles['comment']}>
                <h3 className={styles['comment-title1']}>ВАШИТЕ ОТЗИВИ СА ВАЖНИ ЗА НАС</h3>
 
                <div className={styles['comment-sec']}>
                    {comments?.map(c => (
                        <div key={c._id} className={styles['comment-sec-product']}>
                            <h3 className={styles['comment-sec-title']}><span> </span>{c.username}</h3>
                            <div className={styles['img']}>
                                <img src={c.imageUrl} alt='meal' />
                            </div>
                            <div className={styles['comment-content']}>
                                <p className={styles['comment-content-p']}> {c.comment}</p>
                            </div>
                            {c._ownerId === user.userId && <div className={styles['div-btn']}>
                                <button className={styles['edit-btn']} onClick={() => onEditHandler(c)}>&#9998; Редактирай</button>
                                <button className={styles['delete-btn']} onClick={() => { window.confirm('Сигурни ли сте че искате да изтриете ревюто си ?') && onDeleteHandler(c._id); }} >&#10008; Изтрий</button>
                            </div>}
 
                        </div>
                    )) ||[]}
 
                </div>
                {user.userId && !editForm && <>   <h2 className={styles['comment-title2']}><i className="fa-solid fa-circle-arrow-down"></i> Остави твоя коментар тук <i className="fa-solid fa-circle-arrow-down"></i></h2>
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
                                name="imageUrl"
                                value={review.imageUrl}
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
                    </form> </>}
 
                {editForm && <form className={styles['comments-form']} onSubmit={onEditSubmitHandler}>
                    <div className={styles['username']}>
                        <label htmlFor="username">Псевдоним</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={editComment.username}
                            onChange={onEditChangeHandler}
                        />
                    </div>
                    <div className={styles['image']}>
                        <label htmlFor="image">Снимка</label>
                        <input
                            type="text"
                            id="image"
                            name="imageUrl"
                            value={editComment.imageUrl}
                            onChange={onEditChangeHandler}
                        />
                    </div>
                    <div className={styles['comment-text']}>
                        <label htmlFor="comment">Коментар</label>
                        <textarea
                            type="text"
                            id="comment"
                            name="comment"
                            rows={4}
                            value={editComment.comment}
                            onChange={onEditChangeHandler}
                        />
                    </div>
 
                    <input className={styles['add-btn']} type="submit" value="Редактирай" />
                </form>}
            </section>
 
 
        </main>
 
    );
};
 
export default Comments;