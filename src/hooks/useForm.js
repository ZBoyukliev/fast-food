import { useState } from 'react';

export const useForm = (initialValue) => {
    const [values, setValues] = useState(initialValue);

    const onChangeHandler = (e) => {
        setValues(state => ({...state, [e.target.name]: e.target.value}));
    };

    const changeValues = (newVaues) => {
        setValues(newVaues);
    };

    return {
        values,
        onChangeHandler,
        changeValues
    };
};
