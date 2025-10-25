import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    // State to control animation classes after component mounts
    const [animateHero, setAnimateHero] = useState(false);
    const navigate = useNavigate();

    // Function to navigate to the main chat page (Community)
    const handleStarted = () => {
        // Standardized path to lowercase: /Main -> /main
        navigate('/main'); 
    };
    
    // Function to navigate to the login page
    const handleLogin = () => {
        navigate("/login");
    };
    
    // Function to navigate to the register page
    const handleRegister = () => {
        // Standardized path to lowercase: /Register -> /register
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
        // The main page container
        <div className="min-h-screen bg-[#ede6ff] font-sans overflow-x-hidden">
            
            {/* 1. Navigation Bar */}
            <nav className="sticky top-0 bg-[#ede6ff] bg-opacity-95 backdrop-blur-sm z-50 p-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="container mx-auto p-3 flex items-center justify-between border-b border-gray-200 pb-4">
                    
                    {/* Logo (Left side) - Animates from left */}
                    <div className={`text-2xl font-bold text-gray-800 tracking-wider transition-all duration-500 ease-out ${animateHero ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                        ChatWeb
                    </div>
                    
                    {/* Nav Links and Buttons (Right side) */}
                    <div className="flex items-center space-x-6">
                        <ul className="hidden md:flex space-x-6 text-gray-600 font-semibold">
                            {['Home', 'About us', 'Work', 'Info'].map((item, index) => (
                                <li 
                                    key={item}
                                    // Removed redundant 'text-xl' class and improved delay application
                                    className={`
                                        transition-all duration-500 ease-out 
                                        ${animateHero ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                                    `}
                                    style={{ transitionDelay: `${100 + index * 100}ms` }} // Using inline style for dynamic delay
                                >
                                    <a href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-red-500 transition duration-150">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Login Button */}
                        <button 
                            onClick={handleLogin} // Corrected function name to handleLogin for consistency
                            className={`
                                px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full shadow-lg 
                                hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                                transition-all duration-500 ease-out 
                                ${animateHero ? 'scale-100 opacity-100 delay-500' : 'scale-90 opacity-0 delay-0'} 
                            `}
                        >
                            Login
                        </button>
                        
                        {/* Register Button */}
                        <button 
                            onClick={handleRegister}
                            className={`
                                px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full shadow-lg 
                                hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                                transition-all duration-500 ease-out 
                                ${animateHero ? 'scale-100 opacity-100 delay-[600ms]' : 'scale-90 opacity-0 delay-0'} 
                            `}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <header className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Two-Column Layout for Text and Illustration */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        
                        {/* Left Side: Text Content - Animates from below */}
                        <div 
                            className={`
                                lg:w-1/2 max-w-lg lg:text-left text-center 
                                transition-all duration-700 ease-out delay-100
                                ${animateHero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            `}
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
                                Chat <br className="hidden sm:block" />
                                Messaging
                            </h1>
                            <p className="text-lg text-gray-500 mb-8">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget libero feugiat, faucibus libero id, scelerisque quam.
                            </p>
                            
                            {/* Started Button - Animates after text */}
                            <button onClick={handleStarted}
                                className={`
                                    px-8 py-3 bg-red-500 text-white text-base font-semibold rounded-lg shadow-xl 
                                    hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300
                                    transition-all duration-700 ease-out 
                                    ${animateHero ? 'scale-100 opacity-100 delay-500' : 'scale-95 opacity-0 delay-0'} 
                                `}
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Right Side: Image/Illustration - Animates slightly later than text */}
                        <div 
                            className={`
                                lg:w-1/2 flex justify-center lg:justify-end 
                                transition-all duration-700 ease-out delay-300
                                ${animateHero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            `}
                        >
                            <div className="w-full rounded-xl flex items-center justify-center text-gray-500 text-sm italic overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                                <img 
                                    src="https://myoperator.com/blog/wp-content/uploads/2024/11/How-To-Use-whatsApp-Chat-Dashboard.png" 
                                    alt="Chat illustration" 
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Welcome;