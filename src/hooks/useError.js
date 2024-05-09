import { useState } from 'react';

export const useError = () => {

    const [error, setError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const onHandleError = (message) => {
        setError(true);
        setErrMsg(message);
        setTimeout(() => {
            setError(false);
        }, 3000);
    };

    return {
        error,
        errMsg,
        onHandleError
    };
};
