import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'; // Icons for better UX

// 🚨 API Endpoint updated to use HTTP protocol for local development
const API_REGISTER_ENDPOINT = 'http://localhost:3000/api/v1/user/register'; 

const Register = () => {
    // FIX 1: Corrected 'userName' (camelCase) in state to match the casing used in the input name attribute ('username') later in the JSX.
    const [formData, setFormData] = useState({
        username: '', // Changed from 'userName' to 'username'
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 1. Handle input changes and update state
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        
        if (error) setError(''); 
    };

    // 2. Handle form submission (API Logic Corrected)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation for password match
        if (formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        
        // Basic empty field check
        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            // 🚀 Actual API Call
            const response = await fetch(API_REGISTER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                // Successful Registration
                console.log('Registration successful! Redirecting...');
                navigate('/login'); 
            } else {
                // Registration failed (e.g., username/email already taken)
                const data = await response.json();
                setError(data.message || 'Registration failed. Please check the information.');
            }
        } catch (err) {
            // Network error (e.g., server offline, CORS issue)
            console.error("Network Error:", err);
            setError('Network error. Could not connect to the server.');
        } finally {
            // FIX 2 & 3: Consolidated the 'finally' block to correctly reset loading state.
            // The simulation/duplicate error setting code has been removed.
            setLoading(false); 
        }
    };

    return (
        // Main container: Enhanced gradient background for attractiveness
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 to-purple-50">
            
            {/* Registration Card: Enhanced Visual Polish */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-8 
                         transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl border-t-4 border-indigo-600">
                
                <h2 className="text-3xl font-extrabold text-center text-gray-900 tracking-tight">
                    Create Your Account
                </h2>
                <p className="text-center text-sm text-gray-500">
                    Join the community in just a few clicks!
                </p>
                
                {/* Error Display: Enhanced visibility */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg shadow-md animate-pulse" role="alert">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Username Field: Interactive Input */}
                    <div className="relative group">
                        <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        <input
                            id="username"
                            name="username" // FIX 4: Corrected name attribute to 'username' to match formData key
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 
                                       border border-gray-300 placeholder-gray-500 text-gray-900 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                       transition-all duration-200 shadow-sm hover:border-indigo-400"
                        />
                    </div>

                    {/* Email Field: Interactive Input */}
                    <div className="relative group">
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 
                                       border border-gray-300 placeholder-gray-500 text-gray-900 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                       transition-all duration-200 shadow-sm hover:border-indigo-400"
                        />
                    </div>

                    {/* Password Field: Interactive Input */}
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

                    {/* Confirm Password Field: Interactive Input */}
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 
                                       border border-gray-300 placeholder-gray-500 text-gray-900 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                       transition-all duration-200 shadow-sm hover:border-indigo-400"
                        />
                    </div>

                    {/* Submit Button: Enhanced with Loader */}
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
                                Registering...
                            </div>
                        ) : 'Create Account'}
                    </button>
                </form>

                {/* Link to Login */}
                <div className="text-sm text-center pt-4">
                    <span className="font-medium text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors duration-150"
                        >
                            Log in
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;