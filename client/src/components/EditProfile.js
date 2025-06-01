import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast.config';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: userData ? userData.name : "",
        email: userData ? userData.email : "",
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [originalData, setOriginalData] = useState({
        name: userData ? userData.name : "",
        email: userData ? userData.email : ""
    });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        validateForm();
    }, [formData, isOtpVerified]);


    useEffect(() => {
        if (!userData) {
            toast.error('Please login to access this page', TOAST_CONFIG);
            navigate('/signin');
        }
        else if (userData && !userData.isAccountVerified) {
            toast.error('Please verify your email to access this page', TOAST_CONFIG);
            navigate('/');
        }

        document.title = `Edit Profile | ${userData.name}`;

    })


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const { handleUpdateEmailSend, handleUpdateEmailVerify, handleUpdateProfile } = useContext(AppContext);

    const handleSendOtp = async () => {
        if (await handleUpdateEmailSend(formData.email)) {
            setIsOtpSent(true);
            toast.info('OTP sent successfully!', TOAST_CONFIG);
        }
    };

    const handleVerifyOtp = async () => {
        if (await handleUpdateEmailVerify(formData.otp)) {
            setIsOtpVerified(true);
            toast.info('OTP verified successfully!', TOAST_CONFIG);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await handleUpdateProfile(formData.name, formData.email, formData.newPassword)) {
            toast.info('Profile updated successfully!', TOAST_CONFIG);
            navigate('/dashboard');
        }
    };

    const validateForm = () => {
        const isNameChanged = formData.name !== originalData.name;
        const isEmailChanged = formData.email !== originalData.email;
        const isPasswordValid = formData.newPassword === formData.confirmPassword && formData.newPassword !== '';

        let isValid = false;

        if (isNameChanged && !isEmailChanged) {
            isValid = true;
        } else if (isEmailChanged && isOtpVerified) {
            isValid = true;
        } else if (isPasswordValid) {
            isValid = true;
        }

        setIsFormValid(isValid);
    };

    const handleCancelAndBackToHome = () => {
        // Dummy handler for cancel and back to home action
        toast.info('Changes discarded. Returning to home page', TOAST_CONFIG);
        navigate('/dashboard');
    };


    return (
        <div className="min-h-screen from-gray-900 to-black bg-gradient-to-b text-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
                    Edit Profile
                </h1>

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
                    <div className="space-y-6">
                        <InputField
                            label="Name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isOtpVerified}
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none   transition-all duration-200"
                                    placeholder="your@email.com"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={formData.email === originalData.email || isOtpSent}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none   focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    Send OTP
                                </button>
                            </div>
                        </div>

                        {isOtpSent && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    OTP
                                </label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none   transition-all duration-200"
                                        placeholder="Enter OTP"
                                        maxLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={formData.otp.length !== 6 || isOtpVerified}
                                        className="text-blue-500 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        <InputField
                            label="New Password"
                            name="newPassword"
                            type="password"
                            placeholder="Leave blank to keep current password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                        />

                        <InputField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none   focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Update Profile
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelAndBackToHome}
                                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none  focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                Cancel and Back to Home
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputField({ label, name, type, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none   transition-all duration-200"
                placeholder={placeholder}
            />
        </div>
    );
}