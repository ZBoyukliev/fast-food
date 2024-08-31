import styles from './Comments.module.css';

const EditCommentForm = ({
    onEditChangeHandler,
    onEditSubmitHandler,
    editComment
}) => {

    return (
        <form className={styles['comments-form']} onSubmit={onEditSubmitHandler}>
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
    </form>
    );
};

export default EditCommentForm;
