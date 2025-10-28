import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiLogIn, FiUserPlus } from 'react-icons/fi'; // Added icons for flair

const Welcome = () => {
    // State to control animation classes after component mounts
    const [animateHero, setAnimateHero] = useState(false);
    const navigate = useNavigate();

    // Function to navigate to the main chat page (Community)
    const handleStarted = () => {
        navigate('/main');
    };

    // Function to navigate to the login page
    const handleLogin = () => {
        navigate("/login");
    };

    // Function to navigate to the register page
    const handleRegister = () => {
        navigate("/register");
    };

    useEffect(() => {
        // Trigger animations after component mounts with a slight delay
        const timer = setTimeout(() => {
            setAnimateHero(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        // 1. Main container: Use `h-screen` instead of `min-h-screen` and explicitly set `overflow: hidden`
        <div className="h-screen bg-gray-950 font-sans overflow-x-hidden text-white relative">

            {/* Background Glow/Blob Effect for visual interest */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                {/* Blobs are positioned absolutely, but their outer edges are hidden by the container's overflow-hidden */}
                <div className="absolute top-[0%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] transform translate-y-[-50%]"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[180px] transform translate-y-[50%]"></div>
            </div>

            {/* 1. Navigation Bar (Z-index 50) */}
            <nav className="sticky top-0 bg-gray-950/90 backdrop-blur-sm p-4 sm:px-6 lg:px-8 shadow-2xl shadow-gray-900/50 z-50">
                <div className="container mx-auto p-2 flex items-center justify-between">

                    {/* Logo (Left side) */}
                    <div className={`
                        text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 flex items-center space-x-2
                        transition-all duration-700 ease-out transform
                        ${animateHero ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'}
                    `}>
                        <FiMessageSquare className='w-8 h-8' />
                        <span>NexusChat</span>
                    </div>

                    {/* Nav Links and Buttons (Right side) */}
                    <div className="flex items-center space-x-4 sm:space-x-6">

                        {/* Navigation Links (Hidden on small screens) */}
                        <ul className="hidden md:flex space-x-6 text-gray-300 font-medium">
                            {['Features', 'Developers', 'Pricing'].map((item, index) => (
                                <li
                                    key={item}
                                    className={`
                                        transition-all duration-500 ease-out transform
                                        ${animateHero ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                                    `}
                                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                                >
                                    <a href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition duration-150">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Login Button (Ghost Style) */}
                        <button
                            onClick={handleLogin}
                            className={`
                                px-4 py-2 border border-purple-500 text-purple-400 text-sm font-semibold rounded-full 
                                hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                                transition-all duration-500 ease-out flex items-center space-x-2
                                ${animateHero ? 'scale-100 opacity-100 delay-[500ms]' : 'scale-90 opacity-0 delay-0'} 
                            `}
                        >
                            <FiLogIn className='w-4 h-4' />
                            <span>Login</span>
                        </button>

                        {/* Register Button (Primary) */}
                        <button
                            onClick={handleRegister}
                            className={`
                                px-4 py-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-purple-900/50 
                                hover:from-purple-500 hover:to-teal-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50
                                transition-all duration-500 ease-out flex items-center space-x-2
                                ${animateHero ? 'scale-100 opacity-100 delay-[600ms]' : 'scale-90 opacity-0 delay-0'} 
                            `}
                        >
                            <FiUserPlus className='w-4 h-4' />
                            <span>Register</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section (Content sits above background effects, Z-index 10) */}
            {/* Using flex-1 to occupy remaining height and items-center to vertically center content */}
            <header className="relative mt-10 z-10 flex-1 flex items-center justify-center p-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Two-Column Layout for Text and Illustration */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                        {/* Left Side: Text Content - Animates from below */}
                        <div
                            className={`
                                lg:w-1/2 max-w-xl lg:text-left text-center 
                                transition-all duration-1000 ease-out delay-200
                                ${animateHero ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                            `}
                        >
                            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
                                    Connect.
                                </span>
                                <br />
                                Collaborate.
                            </h1>
                            <p className="text-xl text-gray-400 mb-10">
                                Instantly join vibrant communities and start engaging conversations. Experience lag-free, secure, and intuitive messaging.
                            </p>

                            {/* Started Button - Primary, Large, Animated */}
                            <button onClick={handleStarted}
                                className={`
                                    px-10 py-4 text-lg font-bold rounded-xl shadow-2xl shadow-purple-800/50 
                                    bg-gradient-to-r from-purple-600 to-teal-500 text-white 
                                    hover:from-purple-500 hover:to-teal-400 focus:outline-none focus:ring-4 focus:ring-purple-500
                                    transition-all duration-700 ease-out transform hover:scale-105 active:scale-95
                                    ${animateHero ? 'scale-100 opacity-100 delay-[700ms]' : 'scale-90 opacity-0 delay-0'} 
                                `}
                            >
                                Get Started Now
                            </button>
                        </div>

                        {/* Right Side: Image/Illustration - Glassmorphic Card */}
                        <div
                            className={`
                                lg:w-1/2 max-w-lg p-6 rounded-3xl bg-gray-800/50 border border-purple-500/30 backdrop-blur-md 
                                shadow-2xl shadow-gray-900/80 transform hover:scale-[1.02] transition-all duration-700 ease-out
                                ${animateHero ? 'translate-x-0 opacity-100 delay-[500ms]' : 'translate-x-16 opacity-0 delay-0'}
                            `}
                        >
                            <img
                                src="https://myoperator.com/blog/wp-content/uploads/2024/11/How-To-Use-whatsApp-Chat-Dashboard.png"
                                alt="A modern chat interface illustration"
                                className="w-full h-auto object-cover rounded-2xl border border-gray-700/50"
                            />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Welcome;