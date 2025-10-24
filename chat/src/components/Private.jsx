import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { FiSend, FiSmile, FiUser, FiHome } from 'react-icons/fi';
import {useNavigate } from 'react-router-dom';

// Define the structure for a message
const initialMessages = [
  { id: 1, text: "Welcome to the Community Chat! Feel free to send a message. 👋", sender: 'System' },
];

const Private = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages); 
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for future emoji picker

  // --- Auto-Scroll Effect ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages update

  // --- Socket.IO Connection and Listeners ---
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
    });

    newSocket.on("receive message", (data) => {
      // In a real app, 'Other' should be replaced with a dynamic username from data
      const newMessage = { id: Date.now(), text: data.text, sender: 'Other' }; 
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // --- Send Message Handler ---
  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      const dataToSend = { text: message };
      
      socket.emit("send message", dataToSend); 

      // Optimistic UI Update: 
      const localMessage = { id: Date.now(), text: message, sender: 'You' };
      setMessages(prevMessages => [...prevMessages, localMessage]);
      
      setMessage(""); 
    }
  };
  
  // Placeholder function for adding an emoji
  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
    // You might want to close the picker after selecting an emoji on mobile
    // setShowEmojiPicker(false); 
  };

  // --- UI Structure ---
  return (
    <>
      {/* -------------------- Attractive Navigation Bar (Header) -------------------- */}
      <div className='flex justify-center mt-4 sm:mt-8 px-2 sm:px-4'>
        <nav className='
          w-full max-w-5xl h-14 sm:h-16 
          flex items-center justify-between
          p-3 sm:p-4 bg-white shadow-xl rounded-xl sm:rounded-2xl
          border border-gray-50 transform hover:scale-[1.005] transition-all duration-300
        '>
          <h1 className='text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 tracking-wider'>
            Private chat 💬
          </h1>
          <div className='flex space-x-2 sm:space-x-4'>
           
            <button className='flex items-center space-x-1 py-1 px-2 text-xs sm:text-sm font-medium bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200'>
              <FiUser className="w-4 h-4 sm:w-5 sm:h-5"/> 
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* -------------------- Main Chat Container -------------------- */}
      <div className='flex justify-center my-4 px-2 sm:my-8 sm:px-4'>
        {/* Reduce height slightly on mobile for better screen fit */}
        <div className='w-full max-w-5xl h-[80vh] sm:h-[75vh] flex flex-col bg-white shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden'>
          
          {/* Message History/Feed */}
          <div className='flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-50'>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar/Initial (only for 'Other' or 'System' for simplicity) */}
                {msg.sender !== 'You' && (
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs mr-2 flex-shrink-0 
                      ${msg.sender === 'System' ? 'bg-yellow-400 text-white' : 'bg-indigo-200 text-indigo-700'}`
                  }>
                    {/* Render initial based on sender for better UI */}
                    {msg.sender === 'System' ? 'S' : msg.sender.charAt(0)}
                  </div>
                )}

                {/* Message Bubble - smaller padding and text on mobile */}
                <div className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg text-sm sm:text-base leading-relaxed 
                  ${msg.sender === 'You' 
                    ? 'bg-purple-600 text-white rounded-br-md' 
                    : msg.sender === 'System' 
                      ? 'bg-gray-200 text-gray-600 italic text-center rounded-lg shadow-inner'
                      : 'bg-white text-gray-800 rounded-tl-md border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* -------------------- Attractive Message Input Area -------------------- */}
          <div className='p-2 sm:p-4 border-t border-gray-100 bg-white flex items-center relative'>
            
            {/* Emoji Picker Button */}
            <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className='p-2 text-xl sm:p-3 sm:text-2xl text-gray-500 hover:text-yellow-500 transition duration-150 rounded-full hover:bg-gray-100'
                title="Open Emoji Picker"
            >
                <FiSmile />
            </button>

            {/* Placeholder for the actual Emoji Picker Panel - adjust positioning */}
            {showEmojiPicker && (
              <div className="absolute bottom-[calc(100%+4px)] left-2 sm:left-4 border border-gray-300 rounded-lg shadow-2xl p-2 bg-white z-10 grid grid-cols-6 gap-1">
                {['😊', '😂', '😍', '👍', '🙏', '🎉', '🔥', '❤️', '🤔'].map(emoji => (
                    <button key={emoji} onClick={() => handleEmojiSelect(emoji)} className="text-xl sm:text-2xl hover:bg-gray-100 rounded p-1 transition">{emoji}</button>
                ))}
              </div>
            )}


            {/* Text Input - adjusted padding */}
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className='flex-1 p-2 sm:p-3 mx-2 sm:mx-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-inner text-sm sm:text-base' 
              type="text" 
              placeholder='Type your message here...' 
            />
            
            {/* Send Button - adjusted size */}
            <button 
              onClick={sendMessage} 
              className='p-2 sm:p-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400 disabled:shadow-none'
              disabled={message.trim() === ""}
            >
              <FiSend className="w-5 h-5 sm:w-6 sm:h-6"/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Private;