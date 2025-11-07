import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// Presentational components & constants
import SkeletonCard from './private/SkeletonCard';
import PrivateRoomCard from './private/PrivateRoomCard';
import TokenModal from './private/TokenModal';
import { ROOMS_BY_OWNER_URL, VERIFY_TOKEN_URL } from './private/constants';

/**
 * Private
 * Container component handling fetching of rooms & token verification logic.
 * Logic intentionally unchanged; only structural refactor for production clarity.
 */
const Private = () => {
  const navigate = useNavigate();

  // Data state
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal/token state
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [verifying, setVerifying] = useState(false);

  /** Fetch private rooms owned by user */
  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(ROOMS_BY_OWNER_URL, { method: 'GET', credentials: 'include' });
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRooms(data.rooms || data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      setError('Failed to load private rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** Open token modal for selected room */
  const handleEnterRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setToken('');
    setTokenError('');
    setShowTokenModal(true);
  };

  /** Verify token: roomName passed via query param, token in body */
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setTokenError('');

    if (!token?.trim()) {
      setTokenError('Token is required.');
      return;
    }

    const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
    const roomName = selectedRoom?.roomName || '';

    setVerifying(true);
    try {
      const url = `${VERIFY_TOKEN_URL}?roomName=${encodeURIComponent(roomName)}`;
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.status === 200) {
        console.log('✅ Token verified successfully');
        setShowTokenModal(false);
        navigate('/community/general-chat');
        return;
      }

      if (res.status === 401 || res.status === 403) {
        setTokenError('Invalid or expired token. Please try again.');
        return;
      }

      const text = await res.text();
      setTokenError(text || `Verification failed with status ${res.status}.`);
    } catch (err) {
      console.error('Token verification failed:', err);
      setTokenError('Network error while verifying token.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  if (loading) {
    return (
      <section className="relative rounded-3xl border border-gray-800/60 bg-gray-950/60 p-6 backdrop-blur-md shadow-[0_0_40px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/10">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-900/20 blur-3xl" />
        <header className="relative z-10 mx-auto mb-6 flex max-w-5xl items-center justify-between">
          <h2 className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-3xl font-extrabold text-transparent tracking-tight">Your Private Rooms</h2>
          <div className="h-9 w-28 animate-pulse rounded-xl bg-gray-800" />
        </header>
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative rounded-3xl border border-red-900/50 bg-red-900/10 p-6 backdrop-blur-md ring-1 ring-red-800/30">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-900/40 bg-red-900/20 p-5 text-red-200 shadow-xl">
          <div className="flex items-start gap-3">
            <svg className="h-6 w-6 flex-none" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M11.001 10h2v5h-2zm0-4h2v2h-2z" />
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2z" />
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative rounded-3xl border border-gray-800/60 bg-gray-950/60 p-6 backdrop-blur-md shadow-[0_0_40px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/10">
      {/* Accent glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(40%_40%_at_50%_0%,black,transparent)]">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <div>
          <h2 className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-3xl font-extrabold text-transparent tracking-tight">
            Your Private Rooms
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage and enter your private rooms with a sleek, modern experience.
          </p>
        </div>
        <button
          onClick={fetchRooms}
          className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-fuchsia-900/40 transition duration-300 hover:scale-105 hover:bg-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/40"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 4l-6 6M4 20l6-6" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Rooms grid */}
      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.length === 0 ? (
          <div className="col-span-full">
            <div className="rounded-3xl border border-dashed border-gray-700/60 bg-gray-900/50 p-12 text-center backdrop-blur-md ring-1 ring-indigo-500/10">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-300">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h6v6m-7 4h8a2 2 0 0 0 2-2V9l-5-5H8a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">No private rooms yet</h3>
              <p className="mt-1 text-sm text-gray-400">Create a private room to get started, then come back here to manage it.</p>
            </div>
          </div>
        ) : (
          rooms.map((room) => (
            <PrivateRoomCard key={room.id} room={room} onEnter={handleEnterRoom} />
          ))
        )}
      </div>

      {/* Token Modal */}
      <TokenModal
        visible={showTokenModal}
        token={token}
        tokenError={tokenError}
        verifying={verifying}
        onClose={() => setShowTokenModal(false)}
        onChangeToken={setToken}
        onSubmit={handleVerifyToken}
      />
    </section>
  );
};

export default Private;

// Future extensibility: If converting to a configurable component, define PropTypes here.
Private.propTypes = {};
