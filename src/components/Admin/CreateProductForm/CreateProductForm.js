import styles from './CreateProductForm.module.css';

const CreateProductForm = () => {

    return (
        <>
            <div className={styles['create-form']}>
                <form className={styles['create-form-f']}>
                    <div className={styles['firstname']}>
                        <label htmlFor="firstname">Име*</label>
                        <input
                            type="firstname"
                            id="firstname"
                            name="firstname"
                            defaultValue='x'
                        // value={values.firstname}
                        // onChange={onChangeHandler} 
                        />
                    </div>
                    <div className={styles['firstname']}>
                        <label htmlFor="firstname">Име*</label>
                        <input
                            type="firstname"
                            id="firstname"
                            name="firstname"
                            defaultValue='x'
                        // value={values.firstname}
                        // onChange={onChangeHandler} 
                        />
                    </div>
                    <div className={styles['firstname']}>
                        <label htmlFor="firstname">Име*</label>
                        <input
                            type="firstname"
                            id="firstname"
                            name="firstname"
                            defaultValue='x'
                        // value={values.firstname}
                        // onChange={onChangeHandler} 
                        />
                    </div>
                    <div className={styles['firstname']}>
                        <label htmlFor="firstname">Име*</label>
                        <input
                            type="firstname"
                            id="firstname"
                            name="firstname"
                            defaultValue='x'
                        // value={values.firstname}
                        // onChange={onChangeHandler} 
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateProductForm;