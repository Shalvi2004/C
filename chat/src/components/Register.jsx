import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Updated icons to match the dark, modern theme
import { FaUser, FaLock, FaEnvelope, FaChevronRight } from 'react-icons/fa'; 

// 🚨 API Endpoint updated to use HTTP protocol for local development
const API_REGISTER_ENDPOINT = 'http://localhost:3000/api/v1/user/register'; 

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 1. Handle input changes and update state (Logic Unchanged)
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

    // 2. Handle form submission (Logic Unchanged)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation
        if (formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        
        if (!formData.name || !formData.email || !formData.password) {
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
                console.log('Registration successful! Redirecting...');
                navigate('/login'); 
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed. Please check the information.');
            }
        } catch (err) {
            console.error("Network Error:", err);
            setError('Network error. Could not connect to the server.');
        } finally {
            setLoading(false); 
        }
    };

    return (
        // 1. Main container: Dark background (bg-gray-950) with subtle glow
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[5%] w-72 h-72 bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>
            
            {/* 2. Registration Card: Glassmorphism and Shadow */}
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 md:p-10 space-y-8 
                         transform transition-all duration-300 hover:scale-[1.01] border border-teal-500/20 relative z-10">
                
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 tracking-tight">
                    JOIN chat
                </h2>
                <p className="text-center text-md text-gray-400">
                    Create your new account in moments.
                </p>
                
                {/* Error Display: Dark Theme Style */}
                {error && (
                    <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-r-lg shadow-md animate-pulse text-sm" role="alert">
                        🚨 **Error:** {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    {/* Username Field: Dark Input Style */}
                    <div className="relative group">
                        <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-200" />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Username"
                            className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-200 
                                       border border-gray-700 placeholder-gray-500
                                       focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 
                                       transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Email Field: Dark Input Style */}
                    <div className="relative group">
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-200" />
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
                                       focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 
                                       transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Password Field: Dark Input Style */}
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-200" />
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
                                       focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 
                                       transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Confirm Password Field: Dark Input Style */}
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-200" />
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-200 
                                       border border-gray-700 placeholder-gray-500
                                       focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 
                                       transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Submit Button: Primary Gradient with Animation */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            group relative w-full flex justify-center py-3 px-4 mt-8
                            text-lg font-bold rounded-xl shadow-2xl shadow-teal-900/50 
                            transform transition-all duration-300 ease-in-out items-center space-x-2
                            ${loading 
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                                : 'bg-gradient-to-r from-teal-500 to-purple-600 text-white hover:from-teal-400 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-teal-500/50 active:scale-95'}
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
                        ) : (
                            <>
                                <span>Create Account</span>
                                <FaChevronRight className='w-4 h-4 ml-1'/>
                            </>
                        )}
                    </button>
                </form>

                {/* Link to Login */}
                <div className="text-sm text-center pt-4">
                    <span className="font-medium text-gray-500">
                        Already a member?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-purple-400 hover:text-purple-300 font-bold transition-colors duration-150"
                        >
                            Sign In
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;