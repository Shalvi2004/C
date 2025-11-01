import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ⬅️ Import Axios

// --- Room Configuration (Unchanged) ---
const roomsConfig = [
  {
    name: "General Chat",
    category: "Community",
    icon: "💬",
    description: "Welcome! Meet and chat with the community",
    path: "/community/general-chat",
  },
  {
    name: "Music Lounge",
    category: "Music",
    icon: "🎵",
    description: "Share and discover new music together",
    path: "/community/music-lounge",
  },
];

// 🔐 Function to check user registration using Axios
const checkUserRegistration = async () => {
  // 💡 Replace with your actual backend endpoint
  const API_ENDPOINT = '';
  
  // 1. Get the token from storage (e.g., localStorage or cookies)
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    
    return false;
  }

  // 2. Make an authenticated request using Axios
  try {
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        // Use the token for Authorization (standard Bearer token format)
        'Authorization': `Bearer ${authToken}`
      },
      // Optional: Add a timeout
      timeout: 5000 
    });
    return true; 
    
  } catch (error) {
    // Handle errors (e.g., 401 Unauthorized, network issues, server errors)
    if (axios.isAxiosError(error) && error.response) {
      // Token is invalid, expired, or user doesn't exist (e.g., status 401, 403)
      console.error("API check failed:", error.response.status, error.response.data);
    } else {
      // Network error or other issue
      console.error("Network or request error:", error.message);
    }
    
    // In any error scenario, treat the user as not registered for this action
    return false;
  }
};


// 🎨 RoomCard Component (Unchanged)
const RoomCard = ({ room }) => (
  <Link
    to={room.path}
    className={`
      p-7 rounded-3xl text-white block h-full relative
      bg-gray-900/60 backdrop-blur-md 
      border border-gray-700
      transform transition-all duration-500 ease-in-out
      hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-[1.05]
      shadow-xl
    `}
  >
    {/* ... (rest of RoomCard content) ... */}
    <div className="flex items-center mb-4">
      <div className={`
        text-3xl p-3 rounded-xl mr-4
        bg-indigo-600/20 ring-1 ring-indigo-500
      `}>
        {room.icon}
      </div>
      <span className="text-2xl font-bold text-white tracking-wide">{room.name}</span>
    </div>
    <span className={`
      text-xs font-semibold px-3 py-1 rounded-full
      bg-purple-500 text-white shadow-md
      inline-block mb-4
    `}>
      {room.category}
    </span>
    <p className="text-gray-300 text-base mb-6 h-12 overflow-hidden">
      {room.description}
    </p>
    <div className="flex justify-between items-center mt-4 border-t border-gray-700/50 pt-4">
      <span className="text-sm font-medium text-indigo-400">
        ENTER ROOM →
      </span>
      <div className="flex items-center text-sm text-gray-400">
        <span className="mr-1">🔥 12</span>
        <span className="ml-1 text-sm">online</span>
      </div>
    </div>
  </Link>
);


// 🌌 Community Component with conditional logic
const Community = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const handlePrivate = async () => {
    setIsChecking(true);

    try {
      // Call the Axios-based check function
      const isRegistered = await checkUserRegistration();

      if (isRegistered) {
        // User is registered/logged in: navigate to private chat creation
        navigate("/CreateToken");
      } else {
        // User is not registered/logged in: prompt and redirect
        alert("🔒 You must be logged in to create a private chat. Please register or sign in.");
        // Clear a potentially bad token to ensure a fresh start
        localStorage.removeItem('authToken'); 
        navigate("/login"); // Redirect to your login/registration route
      }
    } catch (error) {
      // This catch block handles unexpected errors outside of the API response (though checkUserRegistration handles most)
      console.error("Unexpected error during private chat attempt:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 overflow-hidden relative">
      {/* ... (Background Glow and Header Section Unchanged) ... */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-200px] left-1/2 w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-3xl transform -translate-x-1/2 animate-pulse-slow"></div>
       </div>

       <div className="relative z-10 max-w-7xl mx-auto">
         <header className="text-center mb-16 pt-10">
           <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 tracking-tight">
             Community Hub
           </h1>
           <p className="text-2xl text-gray-400 font-light max-w-2xl mx-auto">
             Discover and connect across a multiverse of interests.
           </p>
         </header>

         <div className="max-w-4xl mx-auto mb-16">
           <div className="flex items-center space-x-4">
             <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search rooms by name, description, or category..."
                  className={`
                    w-full py-4 pl-14 pr-6 rounded-2xl
                    bg-gray-800/80 backdrop-blur-sm
                    text-white text-lg placeholder-gray-500
                    focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50
                    border border-gray-700/50
                    transition duration-300
                  `}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-fuchsia-400 text-xl">
                  🔎
                </span>
             </div>

            {/* Private Chat Button (Uses isChecking state) */}
            <button
              onClick={handlePrivate}
              disabled={isChecking} 
              className={`
                py-4 px-6 rounded-2xl font-bold text-lg whitespace-nowrap
                bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-900/50
                focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50
                transition duration-300 ease-in-out transform
                flex items-center space-x-2
                ${isChecking 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-fuchsia-500 hover:shadow-fuchsia-700/80 hover:scale-105'
                }
              `}
            >
              <span role="img" aria-label="Private Chat">
                {isChecking ? 'Checking Status...' : '🔒 Private Chat'}
              </span>
            </button>
          </div>
        </div>

        {/* Rooms Section (Unchanged) */}
        <h2 className="text-3xl font-extrabold text-gray-200 mb-8 tracking-wider">
          PUBLIC CHANNELS
        </h2>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
            {roomsConfig.map((room) => (
              <RoomCard key={room.name} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;