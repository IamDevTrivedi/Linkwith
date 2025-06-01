import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { handleSignIn } = useContext(AppContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await handleSignIn(email, password))
      navigate("/");

  };

  document.title = "Sign In | Linkwith | Create Custom Short URLs with Ease";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Gradient Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-400 text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                    focus:outline-none 
                    text-gray-100 placeholder-gray-500 transition-all duration-200"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-400 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 rounded-lg border border-gray-700 
                    focus:outline-none 
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

            {/* Forget Password Link */}
            <div className="text-right">
              <Link to="/forget-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white font-medium rounded-lg transition-all duration-200
                hover:from-blue-600 hover:to-cyan-600 focus:outline-none 
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:from-blue-500 disabled:hover:to-cyan-500"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Didn't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}