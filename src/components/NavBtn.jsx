import React from 'react';
const NavBtn = ({ onClick, direction = 'next', children }) => {
    return (
        <button
            onClick={onClick}
            className='btnColor py-2 px-6 rounded-full text-white text-lg font-semibold transition hover:opacity-80 cursor-pointer'
            >
                {children || (direction === 'next' ? 'Next →' : '← Prev')}
            </button>
    );
};
export default NavBtn;
