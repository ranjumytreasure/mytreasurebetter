import React, { useEffect } from 'react';

const Alert = ({ type, msg, removeAlert, list }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            removeAlert();
        }, 3000);
        return () => clearTimeout(timeout);
    }, [list]);
    return <p className={`alert alert-${type}`} style={{marginTop:"8px"}}>{msg}</p>;
};

export default Alert;
