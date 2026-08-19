import React from 'react';
const NavBtn = ({ onClick, direction = 'next', children }) => {
    return (
        <button
            onClick={onClick}
            className='btnColor transition cursor-pointer'
            >
                {children || (direction === 'next' ? 'Next →' : '← Prev')}
            </button>
    );
};
export default NavBtn;
