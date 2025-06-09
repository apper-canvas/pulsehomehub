import React from 'react';

const Input = ({ value, onChange, placeholder, type = 'text', className, ...rest }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            {...rest}
        />
    );
};

export default Input;