import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa'; 
import axios from 'axios';

// 🚨 IMPORTANT: Replace this with your actual backend login endpoint!
const API_LOGIN_ENDPOINT = 'http://localhost:3000/api/v1/user/login';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '', 
        password: '',
    });
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handles input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (error) setError('');
    };

    // FIX APPLIED: Corrected handling of axios response and error flow
   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            // 🚀 API Call: Directly inside the async event handler.
            const response = await axios.post(
                API_LOGIN_ENDPOINT, 
                formData,
                // Include credentials for HttpOnly cookie session management
                { withCredentials: true } 
            );

            // If axios resolves (status is 2xx), the login was successful.
            setData(response.data);
            console.log("Login Successful:", response.data);

        } catch (err) {
            // Error handling for network errors and non-2xx server responses
           console.log(err);

        } finally {
            setLoading(false); 
        }

    };

    return (
        // 1. Main container: Dark background (bg-gray-950) with subtle radial glow
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] transform -translate-x-1/2"></div>
                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-teal-600/10 rounded-full blur-[120px]"></div>
            </div>
            
            {/* 2. Login Card: Glassmorphism and Shadow */}
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 md:p-10 space-y-8 
                            transform transition-all duration-300 hover:scale-[1.01] border border-purple-500/20 relative z-10">
                
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 tracking-tight">
                    Login

                </h2>
                <p className="text-center text-md text-gray-400">
                    Welcome back! Enter your credentials to continue.
                </p>
                
                {/* Error Display */}
                {error && (
                    <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-r-lg shadow-md animate-pulse text-sm" role="alert">
                        🚨 **Error:** {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Email Field (Dark Input Style) */}
                    <div className="relative group">
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-200" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-200 
                                         border border-gray-700 placeholder-gray-500
                                         focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 
                                         transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Password Field (Dark Input Style) */}
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-200" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-200 
                                         border border-gray-700 placeholder-gray-500
                                         focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 
                                         transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Options/Links */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-teal-400 hover:text-teal-300 transition-colors duration-150">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button - Primary Gradient with Animation */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            group relative w-full flex justify-center py-3 px-4 mt-6
                            text-lg font-bold rounded-xl shadow-2xl shadow-purple-900/50 
                            transform transition-all duration-300 ease-in-out
                            ${loading 
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                                : 'bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:from-purple-500 hover:to-teal-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-95'}
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </div>
                        ) : 'Sign In to Nexus'}
                    </button>
                </form>

                {/* Link to Register */}
                <div className="text-sm text-center pt-4">
                    <span className="font-medium text-gray-500">
                        New to chat?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-teal-400 hover:text-teal-300 font-bold transition-colors duration-150"
                        >
                            Create an Account
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;