import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { FiSend, FiSmile, FiUser, FiHome, FiSettings, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Define the structure for a message
const initialMessages = [
  { id: 1, text: "Welcome to the Community Chat! Feel free to send a message. 👋", sender: 'System' },
  
];

const TechTalk = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages); 
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate(); // Added useNavigate for navigation

  // --- Auto-Scroll Effect ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Socket.IO Connection and Listeners ---
  useEffect(() => {
    // Note: Use a more robust check or context for connection management in a full app
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
    });

    newSocket.on("receive message", (data) => {
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
      setShowEmojiPicker(false); // Close picker after sending
    }
  };
  
  // Placeholder function for adding an emoji
  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
  };

  // --- UI Structure ---
  return (
    // Applied a subtle dark gradient background to the entire page for depth
    <div className='min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex justify-center'>

      <div className='w-full max-w-6xl h-[90vh] flex flex-row rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gray-800'>

       

        {/* -------------------- 2. Main Chat Window -------------------- */}
        <div className='flex-1 flex flex-col'>
          
          {/* Attractive Chat Header */}
          <header className='p-4 sm:p-5 bg-gray-800 border-b border-gray-700/50 flex items-center justify-between shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold text-white'>#Tech-Talk <FiMessageCircle className='inline text-purple-400 ml-1'/></h2>
          </header>

          {/* Message History/Feed */}
          <div className='flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-800/50' style={{backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.05) 0%, transparent 40%)'}}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar/Initial */}
                {msg.sender !== 'You' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0 shadow-md
                      ${msg.sender === 'System' ? 'bg-yellow-600 text-gray-900 border-2 border-yellow-400' : 'bg-indigo-500 text-white border-2 border-indigo-300'}`
                  }>
                    {msg.sender === 'System' ? 'S' : msg.sender.charAt(0)}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[75%] p-3 rounded-xl shadow-xl text-sm sm:text-base leading-relaxed break-words
                  ${msg.sender === 'You' 
                    ? 'bg-purple-600 text-white rounded-br-none hover:bg-purple-500' // Your messages are vibrant purple
                    : msg.sender === 'System' 
                      ? 'bg-gray-600 text-gray-200 italic rounded-lg shadow-inner text-center max-w-full' // System messages are dark and distinct
                      : 'bg-gray-700 text-gray-100 rounded-tl-none hover:bg-gray-600' // Others' messages are dark gray
                  } transition duration-150 ease-in-out cursor-default`}
                >
                  {msg.sender !== 'You' && msg.sender !== 'System' && <div className="text-xs font-semibold text-purple-300 mb-1">{msg.sender}</div>}
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* -------------------- Attractive Message Input Area -------------------- */}
          <div className='p-3 sm:p-4 border-t border-gray-700/50 bg-gray-800 flex items-center relative'>
            
            {/* Emoji Picker Button */}
            <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className='p-3 text-2xl text-yellow-400 hover:text-yellow-300 transition duration-150 rounded-full hover:bg-gray-700'
                title="Open Emoji Picker"
            >
              <FiSmile />
            </button>

            {/* Placeholder for the actual Emoji Picker Panel */}
            {showEmojiPicker && (
              <div className="absolute bottom-[calc(100%+8px)] left-4 sm:left-6 border border-gray-700 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-3 bg-gray-800 z-10 grid grid-cols-6 gap-2">
                {['😊', '😂', '😍', '👍', '🙏', '🎉', '🔥', '❤️', '🤔', '😎', '😇', '🍕'].map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => handleEmojiSelect(emoji)} 
                      className="text-2xl hover:bg-gray-700 rounded p-1 transition"
                    >
                      {emoji}
                    </button>
                ))}
              </div>
            )}


            {/* Text Input - Elevated and Styled */}
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className='flex-1 p-3 mx-3 sm:mx-4 bg-gray-700 text-gray-50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-inner text-base placeholder-gray-400' 
              type="text" 
              placeholder='Type your message...' 
            />
            
            {/* Send Button - More pronounced and visually appealing */}
            <button 
              onClick={sendMessage} 
              className='p-3 bg-purple-600 text-white font-semibold rounded-full shadow-2xl hover:bg-purple-500 transition duration-200 disabled:bg-gray-600 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-purple-500/50'
              disabled={message.trim() === ""}
            >
              <FiSend className="w-6 h-6"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechTalk;