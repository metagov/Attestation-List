import React from 'react';

const Toast = ({ type, message, onClose, isVisible }) => {
    if (!isVisible) return null;

    const toastStyles = {
        success: {
            bgColor: "bg-green-100 dark:bg-green-800",
            textColor: "text-green-500 dark:text-green-200",
            iconPath: "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
        },
        danger: {
            bgColor: "bg-red-100 dark:bg-red-800",
            textColor: "text-red-500 dark:text-red-200",
            iconPath: "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
        },
        warning: {
            bgColor: "bg-orange-100 dark:bg-orange-700",
            textColor: "text-orange-500 dark:text-orange-200",
            iconPath: "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
        }
    };

    const { bgColor, textColor, iconPath } = toastStyles[type] || toastStyles.success;

    return (
        <div className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${bgColor} ${textColor}`} role="alert">
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${bgColor} ${textColor}`}>
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path d={iconPath}/>
                </svg>
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 text-gray-300 hover:text-gray-100 rounded-md focus:ring-2 focus:ring-gray-300 p-1.5  inline-flex items-center justify-center" aria-label="Close">
                <svg className="w-3 h-3" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    );
};

export default Toast;
