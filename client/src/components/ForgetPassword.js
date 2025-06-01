import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { handleResendVerificationOtp, handleResetPassword } = useContext(AppContext);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (await handleResendVerificationOtp(email))
      setStep(2);

  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (await handleResetPassword(email, newPassword, otp))
      navigate('/signin');

  };

  document.title = "Forgot Password | Linkwith | Create Custom Short URLs with Ease";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Gradient Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Forgot Password
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            {step === 1 ? "Enter your email to reset your password" : "Enter the OTP and your new password"}
          </p>
        </div>

        {/* Main Forget Password Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-400 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                      focus:outline-none focus:border-blue-500
                      text-gray-100 placeholder-gray-500 transition-all duration-200"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                  text-white font-medium rounded-lg transition-all duration-200
                  hover:from-blue-600 hover:to-cyan-600 focus:outline-none 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center"
              >
                Send Reset Link
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label htmlFor="otp" className="text-gray-400 text-sm font-medium">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                    focus:outline-none focus:border-blue-500
                    text-gray-100 placeholder-gray-500 transition-all duration-200 text-center text-2xl tracking-widest"
                  required
                  maxLength={6}
                />
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-gray-400 text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                      focus:outline-none focus:border-blue-500
                      text-gray-100 placeholder-gray-500 transition-all duration-200"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                  text-white font-medium rounded-lg transition-all duration-200
                  hover:from-blue-600 hover:to-cyan-600 focus:outline-none 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center"
              >
                Reset Password
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          )}

          <div className="mt-6 text-center">

            {step === 1 ?
              (
                <Link
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  onClick={() => setStep(1)}
                  to="/signin"
                >
                  <span className='text-gray-200'>Remembered your password? </span>
                  Sign In
                </Link>
              )
              :
              (
                <button
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  onClick={() => setStep(1)}
                >
                  <span className='text-gray-200'>Didn't Received OTP?  </span>
                  Resent OTP
                </button>
              )}

          </div>
        </div>
      </div>
    </div>
  );
}

