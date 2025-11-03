import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaDoorOpen, FaKey, FaCopy, FaChevronRight } from 'react-icons/fa';

const API_TOKEN_ENDPOINT = 'http://localhost:3000/api/v1/chat/room';

export default function CreateToken() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [participants, setParticipants] = useState('2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  const validate = () => {
    if (!roomName.trim()) {
      setError('Room name is required');
      return false;
    }
    const n = parseInt(participants, 10);
    if (Number.isNaN(n) || n <= 0) {
      setError('Participants must be a positive number');
      return false;
    }
    if (n > 50) {
      setError('Participants cannot exceed 50');
      return false;
    }
    return true;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setToken('');
    setCopied(false);
    if (!validate()) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('roomName', roomName.trim());
      params.set('participants', String(parseInt(participants, 10)));
      const url = `${API_TOKEN_ENDPOINT}?${params.toString()}`;
  const res = await fetch(url, { method: 'GET', credentials: 'include' });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `Server responded ${res.status}`);
      }
      const data = await res.json();
      const serverToken = data?.token ?? data?.roomToken ?? data?.tokenString;
      if (!serverToken) throw new Error('Token missing in server response');
      setToken(serverToken);
    } catch (err) {
      setError(err?.message || 'Failed to generate token');
      console.log("Error from my side");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setToken('');
      setTimeout(() => setCopied(false), 2000);
      navigate('/Main');
    } catch {
      setError('Failed to copy token');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-96 h-96 bg-teal-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 md:p-10 space-y-8 
                   transform transition-all duration-300 hover:scale-[1.01] border border-teal-500/20 relative z-10">
        
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 tracking-tight">
          Generate Room Token
        </h2>
        <p className="text-center text-md text-gray-400">
          Create a secure access token for your chat room
        </p>

        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-r-lg shadow-md animate-pulse text-sm" role="alert">
            🚨 {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative group">
            <FaDoorOpen className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-200" />
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-200 
                       border border-gray-700 placeholder-gray-500
                       focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 
                       transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="relative group">
            <FaUsers className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-200" />
            <input
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              type="number"
              min="1"
              placeholder="Number of Participants"
              className="appearance-none rounded-xl relative block w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-200 
                       border border-gray-700 placeholder-gray-500
                       focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 
                       transition-all duration-300 shadow-inner"
            />
          </div>

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
            `}>
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              <>
                <FaKey className="w-4 h-4" />
                <span>Generate Token</span>
                <FaChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {token && (
          <div className="mt-4 p-4 bg-gray-800/50 border border-teal-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Your Token</span>
              <FaKey className="text-teal-400 w-4 h-4" />
            </div>
            <div className="font-mono text-sm text-teal-300 break-all mb-3 p-2 bg-gray-900/50 rounded">{token}</div>
            <button 
              onClick={handleCopy}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all duration-200 active:scale-95">
              <FaCopy className="w-4 h-4" />
              <span>Copy Token</span>
            </button>
          </div>
        )}

        {copied && !token && (
          <div className="text-center text-green-400 text-sm animate-pulse">
            ✅ Token copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
