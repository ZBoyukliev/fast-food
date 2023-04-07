
import styles from './Comments.module.css';

const AddCommentForm = ({
    onSubmitHandler,
    onChangeHandler,
    review
}) => {


    return (
        <form className={styles['comments-form']} onSubmit={onSubmitHandler}>
            <div className={styles['username']}>
                <label htmlFor="username">Псевдоним*</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={review.username}
                    onChange={onChangeHandler}
                />
            </div>
            <div className={styles['image']}>
                <label htmlFor="image">Снимка*</label>
                <input
                    type="text"
                    id="image"
                    name="imageUrl"
                    value={review.imageUrl}
                    onChange={onChangeHandler}
                />
            </div>
            <div className={styles['comment-text']}>
                <label htmlFor="comment">Коментар*</label>
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
    );
};

export default AddCommentForm;