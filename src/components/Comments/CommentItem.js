
import styles from './Comments.module.css';

const CommentItem = ({
    comment,
    onEditHandler,
    onDeleteHandler,
    user
}) => {
    return (
        <div className={styles['comment-sec-product']}>
            <h3 className={styles['comment-sec-title']}><span> </span>{comment.username}</h3>
            <div className={styles['img']}>
                <img src={comment.imageUrl} alt='meal' />
            </div>
            <div className={styles['comment-content']}>
                <p className={styles['comment-content-p']}> {comment.comment}</p>
            </div>
            {comment._ownerId === user.userId && <div className={styles['div-btn']}>
                <button className={styles['edit-btn']} onClick={() => onEditHandler(comment)}>&#9998; Редактирай</button>
                <button className={styles['delete-btn']} onClick={() => { window.confirm('Сигурни ли сте че искате да изтриете ревюто си ?') && onDeleteHandler(comment._id); }} >&#10008; Изтрий</button>
            </div>}
        </div>
    );
};

export default CommentItem;