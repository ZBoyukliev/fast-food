
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import styles from './Comments.module.css';
import * as commentsService from '../../services/commentsService';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AddCommentForm from './AddCommentForm';
import EditCommentForm from './EditCommentForm';
import CommentItem from './CommentItem';


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
                <h1 className={styles['comment-title1']}>ВАШИТЕ ОТЗИВИ СА ВАЖНИ ЗА НАС</h1>

                <div className={styles['comment-sec']}>

                    {
                        comments.length === 0 &&
                        <div className={styles['no-comments-d']}>
                            <h2 className={styles['no-comments']}>Все още няма коментари. Осотави първия коментар.</h2>
                            <p className={styles['no-comments-p']}>За да оставиш твоя коментар моля влез в профила си <Link to={'/login'}>тук</Link> или
                                се регистрирай  <Link to={'/login'}>тук</Link>
                            </p>
                        </div>
                    }

                    {comments?.map(c => (
                        <CommentItem key={c._id} 
                        comment={c} 
                        onEditHandler={onEditHandler} 
                        user={user} 
                        onDeleteHandler={onDeleteHandler} />
                    )) || []}

                </div>
                {user.userId && !editForm && <>
                    <h2 className={styles['comment-title2']}>
                        <i className="fa-solid fa-circle-arrow-down"></i>
                        Остави твоя коментар тук
                        <i className="fa-solid fa-circle-arrow-down"></i>
                    </h2>
                    <AddCommentForm onChangeHandler={onChangeHandler} review={review} onSubmitHandler={onSubmitHandler} />
                </>}

                {editForm &&
                    <EditCommentForm
                        onEditChangeHandler={onEditChangeHandler}
                        onEditHandler={onEditHandler}
                        onEditSubmitHandler={onEditSubmitHandler}
                        editComment={editComment}
                    />
                }
                    {!user.userId && comments.length > 0 &&
                        <p className={styles['nouser-show']}>
                            За да оставиш твоя коментар влез в профила си <Link to='/login'>тук</Link>
                            или се регистрирай <Link to='/register'>тук</Link>
                        </p>}
            </section>
        </main>
    );
};

export default Comments;