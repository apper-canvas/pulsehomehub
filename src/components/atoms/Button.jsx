import React from 'react';

const Button = ({ onClick, children, className, type = 'button', ...rest }) => {
    return (
        <button onClick={onClick} className={className} type={type} {...rest}>
            {children}
        </button>
    );
};

export default Button;