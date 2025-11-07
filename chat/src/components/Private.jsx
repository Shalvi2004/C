import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api/v1/private-room/get-room-by-owner';

const Private = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // modal state
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
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

  // open modal on button click
  const handleEnterRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setToken('');
    setTokenError('');
    setShowTokenModal(true);
  };

  // verify token with backend
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setTokenError('');
    if (!token?.trim()) {
      setTokenError('Token is required.');
      return;
    }
    setVerifying(true);
    try {
      // If your backend expects GET with query params:
      const url = `http://localhost:3000/api/v1/chat/room/verify-token?roomId=${encodeURIComponent(
        selectedRoomId
      )}&token=${encodeURIComponent(token)}`;

      // If your backend expects POST instead, switch to method: 'POST' and body: JSON.
      const res = await fetch(url, {
        method: 'POST', // change to 'POST' if needed
        credentials: 'include',
        headers: {
          // If POST, use: 'Content-Type': 'application/json'
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: selectedRoomId, token }), // for POST payloads
      });

      if (res.status === 200) {
        // Success: close modal and navigate
        setShowTokenModal(false);
        // Replace with your router navigation (e.g., react-router)
        navigate('./Chat')
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

  useEffect(() => {
    fetchRooms();
  }, []);

  const SkeletonCard = () => (
    <div className="w-80 rounded-3xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md p-6 shadow-xl ring-1 ring-indigo-500/10">
      <div className="h-5 w-44 animate-pulse rounded bg-gray-800 mb-3" />
      <div className="h-4 w-28 animate-pulse rounded bg-gray-800 mb-6" />
      <div className="h-10 w-full animate-pulse rounded bg-gray-800" />
    </div>
  );

  if (loading) {
    return (
      <section className="relative rounded-3xl border border-gray-800/60 bg-gray-950/60 p-6 backdrop-blur-md shadow-[0_0_40px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/10">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-900/20 blur-3xl" />
        <header className="relative z-10 mx-auto mb-6 flex max-w-5xl items-center justify-between">
          <h2 className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-3xl font-extrabold text-transparent tracking-tight">
            Your Private Rooms
          </h2>
          <div className="h-9 w-28 animate-pulse rounded-xl bg-gray-800" />
        </header>
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Token modal while loading not shown */}
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

      {/* Grid */}
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
              <p className="mt-1 text-sm text-gray-400">
                Create a private room to get started, then come back here to manage it.
              </p>
            </div>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="group relative w-80 overflow-hidden rounded-3xl border border-gray-800/60 bg-gray-900/60 p-6 shadow-xl backdrop-blur-md ring-1 ring-indigo-500/10 transition-all duration-500 hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-[1.03]"
            >
              {/* Hover aura */}
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-2xl transition group-hover:opacity-100">
                <div className="h-full w-full bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h3 className="max-w-[12rem] truncate text-lg font-semibold text-white">
                  {room.roomName || 'Room Name Missing'}
                </h3>
                <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-200">
                  <svg className="mr-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4h-5M2 20h5V10H2m8 10h4V14h-4" />
                  </svg>
                  {room.participantsCount || '—'}
                </span>
              </div>

              <p className="mb-5 line-clamp-2 text-sm text-gray-400">
                Private room for focused discussions and collaboration.
              </p>

              <button
                onClick={() => handleEnterRoom(room.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-indigo-900/40 transition hover:scale-[1.02] hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Enter Room
              </button>
            </div>
          ))
        )}
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Enter Access Token</h3>
              <button
                onClick={() => setShowTokenModal(false)}
                className="rounded-full p-1 text-gray-400 hover:text-gray-200"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleVerifyToken}>
              <label className="block text-sm text-gray-300 mb-2">Token</label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your room token"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-indigo-500"
                autoFocus
              />
              {tokenError && (
                <p className="mt-2 text-sm text-red-400">{tokenError}</p>
              )}

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="rounded-xl px-4 py-2 text-sm text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-60"
                >
                  {verifying ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 0 1 8-8" strokeWidth="4" className="opacity-75" />
                      </svg>
                      Verifying…
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      Verify & Enter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Private;
