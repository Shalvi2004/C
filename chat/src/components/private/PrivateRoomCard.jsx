import React from 'react';
import PropTypes from 'prop-types';

/**
 * PrivateRoomCard
 * Presentational card for a private room item.
 * Props:
 * - room: { id, roomName, participantsCount }
 * - onEnter: (roomId: string|number) => void
 */
const PrivateRoomCard = ({ room, onEnter }) => (
  <div
    className="group relative w-80 overflow-hidden rounded-3xl border border-gray-800/60 bg-gray-900/60 p-6 shadow-xl backdrop-blur-md ring-1 ring-indigo-500/10 transition-all duration-500 hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-[1.03]"
  >
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
      onClick={() => onEnter(room.id)}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-indigo-900/40 transition hover:scale-[1.02] hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      Enter Room
    </button>
  </div>
);

PrivateRoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    roomName: PropTypes.string,
    participantsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onEnter: PropTypes.func.isRequired,
};

export default PrivateRoomCard;
