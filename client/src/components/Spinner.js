import React from 'react';

const Spinner = ({ size = 'default' }) => {
    const sizeClasses = {
        small: 'w-8 h-8',
        default: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    return (
        <div className='h-screen flex items-center justify-center from-gray-900 to-black bg-gradient-to-b'>
            <div className="flex items-center justify-center">
                <div className={`${sizeClasses[size]} relative`}>
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-purple-500 animate-spin animation-delay-150"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>

        </div>
    );
};

export default Spinner;