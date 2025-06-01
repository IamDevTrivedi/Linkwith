import React from 'react';
import { Frown, ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    const goBackHome = () => {
        navigate('/');
    };

    document.title = "Page Not Found | 404"; 

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black/50 text-gray-300 px-4">
            {/* Icon */}
            <Frown className="h-24 w-24 text-sky-400 mb-6" />

            {/* Title */}
            <h1 className="text-6xl font-bold text-white text-center mb-4">
                404
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-400 text-center mb-8">
                Oops! The page you are looking for doesn’t exist.
            </p>

            {/* Button */}
            <button
                onClick={goBackHome}
                className="flex items-center px-6 py-3 bg-sky-400 text-black font-semibold text-lg rounded-md transition duration-300 hover:bg-black hover:text-sky-400 hover:border hover:border-sky-400"
            >
                <ArrowLeftCircle className="h-5 w-5 mr-2" />
                Go Back Home
            </button>
        </div>
    );
}
