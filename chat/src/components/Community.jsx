import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Private from './Private';
import axios from 'axios'; 

// --- Configuration and RoomCard remain unchanged ---
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


// 🌌 Community Component
const Community = () => {
  // Removed isAuthenticated, isChecking, and useEffect
  const navigate = useNavigate();

  // MODIFIED: Simplified handlePrivate function to just navigate
  const handlePrivate = () => {
    navigate('/CreateToken');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 overflow-hidden relative">
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

            {/* Private Chat Button (No checks) */}
            <button
              onClick={handlePrivate}
              className={`
                py-4 px-6 rounded-2xl font-bold text-lg whitespace-nowrap
                bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-900/50
                focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50
                transition duration-300 ease-in-out transform
                flex items-center space-x-2
                hover:bg-fuchsia-500 hover:shadow-fuchsia-700/80 hover:scale-105
              `}
            >
              <span role="img" aria-label="Private Chat">
                🔒 Private Chat
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
    {/* PRIVATE SECTION */}
    <div className='mt-10'>
    <Private/>
    </div>
    
    </div>
  );
};

export default Community;