import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from './NotFound'
import axios from "axios"

export default function Redirect() {

    document.title = "Redirecting | Please Wait";

    const { shortURL } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {

        const func = async () => {
            try {
                const { data } = await axios.post(`${BACKEND_URL}/api/urls/redirect`, {
                    shortURL
                })

                if (data.redirection) {
                    window.location.href = data.longURL;
                    return;
                } else {
                    setError(true);
                    return;
                }
            } catch (err) {
                console.error('Redirection error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        func();

    }, [shortURL, BACKEND_URL]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-black p-4">
                <div className="animate-pulse">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 text-white mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                    </svg>
                </div>
                <div className="text-2xl font-semibold text-white animate-bounce">
                    Redirecting to your destination...
                </div>
                <div className="mt-4 text-sm text-white opacity-75">
                    Please wait while we connect you
                </div>
            </div>
        );
    }

    if (error) {
        return <NotFound />;
    }

    return null;
}