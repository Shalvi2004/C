import React from 'react';
// 1. **IMPROTANT:** You must import 'Link' from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Room configuration data, including a 'path' for routing
const roomsConfig = [
  {
    name: "General Chat",
    category: "Community",
    icon: "💬",
    description: "Welcome! Meet and chat with the community",
    path: "/community/general-chat", // The route the user will be directed to
  },
  {
    name: "Tech Talk",
    category: "Technology",
    icon: "💻",
    description: "Discuss the latest in technology and coding",
    path: "/community/tech-talk",
  },
  {
    name: "Gaming Hub",
    category: "Gaming",
    icon: "🎮",
    description: "Share your gaming experiences and find teammates",
    path: "/community/gaming-hub",
  },
  {
    name: "Creative Corner",
    category: "Creative",
    icon: "🎨",
    description: "Art, design, and creative projects showcase",
    path: "/community/creative-corner",
  },
  {
    name: "Music Lounge",
    category: "Music",
    icon: "🎵",
    description: "Share and discover new music together",
    path: "/community/music-lounge",
  },
  {
    name: "Study Group",
    category: "Education",
    icon: "📚",
    description: "Collaborate and help each other learn",
    path: "/community/study-group",
  },
];

// The RoomCard component is now wrapped in a React Router 'Link'
const RoomCard = ({ room }) => (
  // The 'Link' component directs the user to the specified 'to' path when clicked
  <Link 
    to={room.path} 
    className={`
      p-6 rounded-xl text-white block h-full
      bg-gray-800 bg-opacity-50
      border-2 border-transparent 
      hover:border-purple-500 hover:shadow-2xl hover:scale-[1.02]
      transition-all duration-300 ease-in-out
      shadow-lg
    `}
  >
    {/* Icon and Name */}
    <div className="flex items-center mb-4">
      <div className={`
        text-2xl p-2 rounded-lg mr-3
        bg-gray-700
      `}>
        {room.icon}
      </div>
      <span className="text-xl font-semibold">{room.name}</span>
    </div>

    {/* Category Tag */}
    <span className={`
      text-xs font-medium px-2 py-0.5 rounded-full
      bg-purple-700 text-white
      inline-block mb-3
    `}>
      {room.category}
    </span>

    {/* Description */}
    <p className="text-gray-400 text-sm mb-4 h-10">
      {room.description}
    </p>

    {/* Online Counter */}
    <div className="flex items-center text-sm text-gray-300">
      <span className="mr-1">👤</span>
      <span className="ml-1 text-sm text-gray-500">online</span>
    </div>
  </Link>
);

const Community = () => {
  const navigate = useNavigate();
  const handlePrivate=()=>{
    navigate("/Private")
  }
  return (
    <div className="min-h-screen bg-[#ede6ff] text-white p-8">
      
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-4">
          Community Hub
        </h1>
        <p className="text-xl text-gray-400">
          Join vibrant conversations in rooms that match your interests
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-12"> 
  <div className="relative flex items-center space-x-3"> {/* Added 'flex items-center space-x-3' */}
    {/* Search Input Container */}
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder="Search rooms by name, description, or category..."
        className={`
          w-full py-4 pl-12 pr-4 rounded-xl
          bg-gray-800 bg-opacity-70
          text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-purple-500
          border border-gray-700
        `}
      />
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
        🔍
      </span>
    </div>

    {/* Abbreviated (Icon) Private Chat Button */}
    <button
      onClick={handlePrivate}
      title="Private Chat" // Tooltip for accessibility and clarity
      className={`
        p-3 rounded-xl 
        bg-purple-600 text-white text-2xl
        hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 
        transition duration-150 ease-in-out
        flex-shrink-0 // Prevents the button from shrinking
      `}
    >
      {/* Icon representing the Private Chat/Message functionality */}
      <span role="img" aria-label="Private Chat">
        Private Chat
      </span>
    </button>
  </div>
</div>

      {/* Rooms Section */}
      <div className="max-w-6xl mx-auto">
    

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsConfig.map((room) => (
            <RoomCard key={room.name} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;