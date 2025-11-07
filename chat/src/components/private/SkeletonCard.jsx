import React from 'react';

/**
 * SkeletonCard
 * Loading placeholder for private room card while fetching data.
 */
const SkeletonCard = () => (
  <div className="w-80 rounded-3xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md p-6 shadow-xl ring-1 ring-indigo-500/10">
    <div className="h-5 w-44 animate-pulse rounded bg-gray-800 mb-3" />
    <div className="h-4 w-28 animate-pulse rounded bg-gray-800 mb-6" />
    <div className="h-10 w-full animate-pulse rounded bg-gray-800" />
  </div>
);

export default SkeletonCard; // Stateless, no PropTypes required.
