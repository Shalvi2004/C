import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';

// 🚨 IMPORTANT: Replace this with your actual backend login endpoint!
const API_LOGIN_ENDPOINT = 'http://localhost:3000/api/v1/user/login';

const Login = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
    });
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

    // 2. Handle form submission with API Call
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.userName || !formData.password) {
            setError('Please enter both username and password.');
            setLoading(false);
            return;
        }

        try {
            // 🚀 API Call to the backend
            const response = await fetch(API_LOGIN_ENDPOINT, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // You might add an Authorization header here later for token refresh, but not for initial login
                },
                // Send username and password in the request body
                body: JSON.stringify(formData), 
            });

            const data = await response.json();

            if (response.ok) {
                // Successful Login (HTTP Status 200-299)
                console.log('Login successful. Received data:', data);
                
                // 🔑 You must save the authentication token/user data here!
                // Example: localStorage.setItem('authToken', data.token);
                
                navigate('/main'); // Redirect to the community page
            } else {
                // Failed Login (HTTP Status 400 or 500)
                // Display the error message returned from the server
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            // Network or parsing error
            console.error('Login error:', err);
            setError('Could not connect to the server. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main container: full screen, radial gradient background
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 to-purple-50">
            
            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-8 
                        transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl border-t-4 border-indigo-600">
                
                <h2 className="text-3xl font-extrabold text-center text-gray-900 tracking-tight">
                    Welcome Back!
                </h2>
                <p className="text-center text-sm text-gray-500">
                    Sign in to join the community chat.
                </p>
                
                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg shadow-md animate-pulse" role="alert">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Username Field */}
                    <div className="relative group">
                        <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Username"
                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 
                                       border border-gray-300 placeholder-gray-500 text-gray-900 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                       transition-all duration-200 shadow-sm hover:border-indigo-400"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 
                                       border border-gray-300 placeholder-gray-500 text-gray-900 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                       transition-all duration-200 shadow-sm hover:border-indigo-400"
                        />
                    </div>

                    {/* Options/Links */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button - Enhanced with Loader */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            group relative w-full flex justify-center py-3 px-4 mt-6
                            text-base font-semibold rounded-lg shadow-lg 
                            transform transition-all duration-200 ease-in-out
                            ${loading 
                                ? 'bg-indigo-400 cursor-not-allowed text-gray-200' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300'}
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
                        ) : 'Sign In'}
                    </button>
                </form>

                {/* Link to Register */}
                <div className="text-sm text-center pt-4">
                    <span className="font-medium text-gray-600">
                        New to ChatWeb?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors duration-150"
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