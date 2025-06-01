import React, { useState, useContext, useEffect } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast.config';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const { userData, handleOtpVerification, handleSendVerificationOtp, isVerifyOtpSend, setIsVerifyOtpSend } = useContext(AppContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await handleOtpVerification(otp)) {
      setIsVerified(true);
      navigate("/");
    }
  };

  useEffect(() => {

    document.title = "Verify Email | Linkwith | Create Custom Short URLs with Ease";

    if (isVerifyOtpSend) {
      return;
    }

    if (userData === null) {
      toast.error("Please SignIn Or SignUp to Verify Email", TOAST_CONFIG);
      navigate("/signin");
      return;
    }

    if (userData.isAccountVerified) {
      toast.info("Account Already Verified", TOAST_CONFIG)
      navigate("/");
      return;
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Gradient Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Verify Your Email
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            We've sent a verification code to your email
          </p>
        </div>

        {/* Main Verify Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
          <div className="flex items-center justify-center mb-6">
            <Mail className="text-blue-400 w-16 h-16" />
          </div>
          <p className="text-center text-gray-300 mb-6">
            An email with a verification code has been sent to your registered email address. Please enter the code below to verify your account.
          </p>
          {!isVerified ? (
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-gray-400 text-sm font-medium">
                    Enter Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                    focus:outline-none
                    text-gray-100 placeholder-gray-500 transition-all duration-200 text-center text-2xl tracking-widest"
                    required
                    maxLength={6}
                  />
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                  text-white font-medium rounded-lg transition-all duration-200
                  hover:from-blue-600 hover:to-cyan-600 focus:outline-none 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={otp.length !== 6}
                >
                  Verify Email
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  onClick={async () => {
                    await handleSendVerificationOtp();
                    setIsVerified(false);
                    navigate("/verify-email");
                  }}
                >
                  <span className='text-white'>Didn't receive the code?</span> Resend
                </button>
              </div>
            </div>

          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
              <p className="text-green-400 text-xl font-semibold">Email Verified Successfully!</p>
              <p className="text-gray-400">You can now proceed to use your account.</p>

              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium rounded-lg transition-all duration-200
                hover:from-blue-600 hover:to-cyan-600 focus:outline-none"
                onClick={() => {
                  navigate("/");
                }}
              >
                Go to Home
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};