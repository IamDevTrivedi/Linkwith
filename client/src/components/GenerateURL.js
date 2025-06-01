import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Copy, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast.config';

// Main component for generating custom short URLs
export default function GenerateURL() {
  // State variables
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [check, setCheck] = useState({
    status: 'idle', // URL availability status: 'idle', 'checking', 'available', 'unavailable', or 'error'
    message: ''
  });
  const [generatedURL, setGeneratedURL] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [urlTitle, setUrlTitle] = useState('');

  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  // Environment variables
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const FRONTEND_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://linkwith.vercel.app';

  // Utility function to validate URLs
  const isValidURL = useCallback((url) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  // Function to check the availability of the custom short URL
  const checkAvailability = useCallback(async (value) => {
    if (value.length === 0) {
      setCheck({ status: 'idle', message: '' });
      return;
    }

    setCheck({ status: 'checking', message: 'Checking availability...' });

    try {
      const response = await fetch(`${BACKEND_URL}/api/urls/check-availability/${value}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();

      if (data.status === 'available') {
        setCheck({ status: 'available', message: 'Short URL is available' });
      } else {
        setCheck({ status: 'unavailable', message: 'Short URL is not available' });
      }
    } catch (err) {
      console.error('Error while checking availability:', err);
      setCheck({ status: 'error', message: 'An error occurred while checking availability' });
    }
  }, [BACKEND_URL]);

  // Handle changes to the short URL input field
  const handleShortURLChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    const sanitizedValue = value.replace(/[^a-z0-9-]/g, ''); // Allow only alphanumeric and hyphen
    setShortURL(sanitizedValue);
    checkAvailability(sanitizedValue); // Immediately check availability
  };

  // Handle the form submission to generate a short URL
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!isValidURL(longURL)) {
      setCheck({ status: 'error', message: 'Please enter a valid long URL' });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/urls/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          longURL,
          shortURL: shortURL || undefined,
          urlTitle: urlTitle || undefined,
          userId: userData._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate short URL');
      }

      const data = await response.json();
      setGeneratedURL(data);
      setCheck({ status: 'available', message: 'Short URL created successfully' });
      setShortURL(''); // Reset custom short URL input
    } catch (error) {
      console.error('Error during URL generation:', error);
      setCheck({ status: 'error', message: error.message || 'An error occurred while generating the short URL' });
    }
  };

  // Handle copying the generated URL to clipboard
  const handleCopyURL = async () => {
    if (generatedURL?.shortURL) {
      try {
        await navigator.clipboard.writeText(`${FRONTEND_URL}/s/${generatedURL.shortURL}`);
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus(''), 2000);
      } catch (err) {
        console.error('Failed to copy URL', err);
        setCopyStatus('error');
      }
    }
  };

  // Determine if the "Generate" button should be disabled
  const isButtonDisabled =
    !longURL ||
    check.status === 'unavailable' ||
    check.status === 'checking' ||
    !isValidURL(longURL) ||
    !userData ||
    !userData.isAccountVerified;

  // Component for displaying status icons
  const StatusIcon = () => {
    switch (check.status) {
      case 'available':
        return <CheckCircle2 className="text-green-500 w-5 h-5" />;
      case 'unavailable':
        return <AlertTriangle className="text-red-400 w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="text-red-800 w-5 h-5" />;
      default:
        return null;
    }
  };


  document.title = "Generate URL | Linkwith | Create Custom Short URLs with Ease";

  useEffect(() => {
    if (!userData) {
      toast.error("You need to login to access this page", TOAST_CONFIG);
      navigate('/signin');
    }
    else if (!userData.isAccountVerified) {
      toast.error("Please verify your account to access this page", TOAST_CONFIG);
      navigate('/');
    }
  })


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Gradient Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            URL Shortener
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Transform your long URLs into memorable short links
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Long URL Input */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium">
                Long URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={longURL}
                  onChange={(e) => setLongURL(e.target.value)}
                  placeholder="https://your-long-url.com"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                    focus:outline-none
                    text-gray-100 placeholder-gray-500 transition-all duration-200"
                  required
                />
                {longURL && !isValidURL(longURL) && (
                  <div className="absolute -bottom-6 left-0 flex items-center text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Please enter a valid URL
                  </div>
                )}
              </div>
            </div>

            {/* Custom Short URL Input */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium">
                Custom Short URL (Optional)
              </label>
              <div className="relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={shortURL}
                    onChange={handleShortURLChange}
                    placeholder="custom-name"
                    className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                      focus:outline-none
                      text-gray-100 placeholder-gray-500 transition-all duration-200"
                    maxLength={20}
                  />
                  <div className="absolute right-3 top-1/3 transform -translate-y-1/2">
                    <StatusIcon />
                  </div>
                </div>
                {check.message && (
                  <p className={`mt-2 text-sm ${check.status === 'available' ? 'text-green-500' :
                    check.status === 'unavailable' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                    {check.message}
                  </p>
                )}
              </div>
            </div>

            {/* Title of the URL Input */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium">
                Title of the URL (Optional)
              </label>
              <input
                type="text"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                placeholder="Enter a Descriptive title"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                  focus:outline-none
                  text-gray-100 placeholder-gray-500 transition-all duration-200"
                maxLength={100}
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium rounded-lg transition-all duration-200
                hover:from-blue-600 hover:to-cyan-600 focus:outline-none 
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:from-blue-500 disabled:hover:to-cyan-500"
            >
              Generate Short URL
            </button>
          </form>

          {/* Generated URL Result */}
          {generatedURL && (
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 mb-1">Your shortened URL</p>
                  <a
                    href={`${FRONTEND_URL}/s/${generatedURL.shortURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium truncate block"
                  >
                    {`${FRONTEND_URL}/s/${generatedURL.shortURL}`}
                  </a>
                </div>
                <button
                  onClick={handleCopyURL}
                  className="ml-4 p-2 text-gray-400 hover:text-white rounded-md
                    hover:bg-gray-700/50 transition-colors duration-200"
                >
                  {copyStatus === 'copied' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};