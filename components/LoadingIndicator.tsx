
import React from 'react';

interface LoadingIndicatorProps {
    message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-semibold text-purple-300 animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingIndicator;
