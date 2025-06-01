import React, { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast.config';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    // State Declarations
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const FRONTEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : "https://linkwith.vercel.app";
    const [isVerifyOtpSend, setIsVerifyOtpSend] = useState(false);

    const getUserData = async () => {

        const endpoint = `${BACKEND_URL}/api/user/get-user-data`;

        try {

            const { data } = await axios.post(endpoint, {}, { withCredentials: true });

            if (data.success) {
                setUserData(data.userData);
                setIsLoggedIn(true);
            }
            else {
                toast.error(data.message || 'Failed to get user data', TOAST_CONFIG);
            }


        } catch (error) {
            console.error('Error getting user data:', error);
            toast.error('Failed to get user data', TOAST_CONFIG);
        }

    }

    // Function: Send Verification OTP
    const handleSendVerificationOtp = async () => {
        const endpoint = `${BACKEND_URL}/api/auth/send-verification-otp`;

        try {
            const { data } = await axios.post(endpoint, {}, { withCredentials: true });
            if (data.success) {
                toast.info('Verification OTP sent successfully', TOAST_CONFIG);
                setIsVerifyOtpSend(true);

                return true;
            } else {
                toast.error(data.message || 'Failed to send verification OTP', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error sending verification OTP:', error);
            toast.error('Failed to send verification OTP', TOAST_CONFIG);

            return false;
        }
    };

    // Function: Sign Up
    const handleSignUp = async (name, email, password) => {
        const endpoint = `${BACKEND_URL}/api/auth/register`;

        try {
            const { data } = await axios.post(
                endpoint,
                { name, email, password },
                { withCredentials: true }
            );

            if (data.success) {
                await handleSendVerificationOtp();
                await getUserData();
                toast.info('Account created successfully', TOAST_CONFIG);

                return true;
            } else {
                toast.error(data.message || 'Account creation failed', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error signing up:', error);
            toast.error('Failed to sign up', TOAST_CONFIG);

            return false;
        }
    };

    // Function: Sign In
    const handleSignIn = async (email, password) => {
        const endpoint = `${BACKEND_URL}/api/auth/login`;

        try {
            const { data } = await axios.post(
                endpoint,
                { email, password },
                { withCredentials: true }
            );

            if (data.success) {
                setUserData(data.data);
                setIsLoggedIn(true);

                await getUserData();

                toast.info('Logged in successfully', TOAST_CONFIG);

                return true;
            } else {
                toast.error(data.message || 'Login failed', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('Failed to sign in', TOAST_CONFIG);

            return false;
        }
    };

    // Function: Logout
    const handleLogout = async () => {
        const endpoint = `${BACKEND_URL}/api/auth/logout`;

        try {
            const { data } = await axios.post(endpoint, {}, { withCredentials: true });

            if (data.success) {
                toast.info('Logged out successfully', TOAST_CONFIG);
                setUserData(null);
                setIsLoggedIn(false);

                document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                return true;
            } else {
                toast.error(data.message || 'Logout failed', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to log out', TOAST_CONFIG);

            return false;
        }
    };

    // Function: OTP Verification
    const handleOtpVerification = async (otp) => {
        const endpoint = `${BACKEND_URL}/api/auth/verify-account`;

        try {
            const { data } = await axios.post(
                endpoint,
                { otp },
                { withCredentials: true }
            );

            if (data.success) {
                toast.info('OTP verified successfully', TOAST_CONFIG);
                setIsVerifyOtpSend(false);
                await getUserData();

                return true;

            } else {
                toast.error(data.message || 'OTP verification failed', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP', TOAST_CONFIG);

            return false;
        }
    };

    // Function: Resend Verification OTP
    const handleResendVerificationOtp = async (email) => {
        const endpoint = `${BACKEND_URL}/api/auth/send-reset-otp`;

        try {
            const { data } = await axios.post(endpoint, { email }, { withCredentials: true });

            if (data.success) {
                toast.info('Verification OTP sent successfully', TOAST_CONFIG);

                return true;
            } else {
                toast.error(data.message || 'Failed to send verification OTP', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error sending verification OTP:', error);
            toast.error('Failed to send verification OTP', TOAST_CONFIG);

            return false;
        }
    };

    // Function: Reset Password
    const handleResetPassword = async (email, password, otp) => {
        const endpoint = `${BACKEND_URL}/api/auth/reset-password`;

        try {
            const { data } = await axios.post(
                endpoint,
                { email, password, otp },
                { withCredentials: true }
            );

            if (data.success) {
                toast.info('Password reset successfully', TOAST_CONFIG);
                return true;
            } else {
                toast.error(data.message || 'Password reset failed', TOAST_CONFIG);

                return false;
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Failed to reset password', TOAST_CONFIG);

            return false;
        }
    };


    const getDashboardData = async () => {

        const endpoint = `${BACKEND_URL}/api/urls/get-dashboard-data`;

        try {
            const { data } = await axios.post(endpoint, { userId: userData._id }, { withCredentials: true });


            if (data.success) {
                return data;
            }
            else {
                toast.error(data.message || 'Failed to get analytics data', TOAST_CONFIG);
                return null;
            }
        } catch (error) {
            console.error('Error getting analytics data:', error);
            toast.error('Failed to get analytics data', TOAST_CONFIG);
        }



    };

    const getShortURLData = async (shortURL) => {

        const endpoint = `${BACKEND_URL}/api/urls/get-url-data`;

        try {
            const { data } = await axios.post(endpoint, { shortURL, userId: userData._id }, { withCredentials: true });

            if (data.success) {
                return data;
            }
            else {
                toast.error(data.message || 'Failed to get short URL data', TOAST_CONFIG);

                return null;
            }
        } catch (error) {
            console.error('Error getting short URL data:', error);
            toast.error('Failed to get short URL data', TOAST_CONFIG);
        }
    };


    const handleUpdateEmailSend = async (email) => {

        const endpoint = `${BACKEND_URL}/api/user/update-email-send`;

        try {

            const { data } = await axios.post(endpoint, { email }, { withCredentials: true });

            if (data.success) {
                toast.info('Otp sent to New Email', TOAST_CONFIG);
                return true;
            }
            else {
                toast.error(data.message || 'Failed to send email update request', TOAST_CONFIG);

                return false;
            }

        } catch (error) {
            console.error('Error updating email:', error);
            toast.error('Failed to update email', TOAST_CONFIG);

            return false;
        }
    };

    const handleUpdateEmailVerify = async (otp) => {

        const endpoint = `${BACKEND_URL}/api/user/update-email-verify`;

        try {

            const { data } = await axios.post(endpoint, { otp }, { withCredentials: true });

            if (data.success) {
                toast.info('Email Verified Successfully', TOAST_CONFIG);
                return true;
            }
            else {
                toast.error(data.message || 'Failed to update email', TOAST_CONFIG);

                return false;
            }

        } catch (error) {
            console.error('Error updating email:', error);
            toast.error('Failed to update email', TOAST_CONFIG);

            return false;
        }
    };


    const handleUpdateProfile = async (name, email, password) => {

        const endpoint = `${BACKEND_URL}/api/user/update-profile`;

        try {

            const { data } = await axios.post(endpoint, { name, email, password }, { withCredentials: true });

            if (data.success) {
                toast.info('Profile Updated Successfully', TOAST_CONFIG);
                getUserData();
                return true;
            }
            else {
                toast.error(data.message || 'Failed to update profile', TOAST_CONFIG);

                return false;
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile', TOAST_CONFIG);

            return false;
        }
    };

    // Context Value
    const value = {

        userData,
        setUserData,

        isVerifyOtpSend,
        setIsVerifyOtpSend,

        isLoggedIn,
        setIsLoggedIn,

        handleSignUp,
        handleSignIn,
        handleLogout,

        handleOtpVerification,
        handleSendVerificationOtp,

        handleResendVerificationOtp,
        handleResetPassword,

        getDashboardData,
        getShortURLData,

        FRONTEND_URL,

        handleUpdateEmailSend,
        handleUpdateEmailVerify,
        handleUpdateProfile
    };

    // Return Provider
    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    );
};