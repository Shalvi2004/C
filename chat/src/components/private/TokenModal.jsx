import React from 'react';
import PropTypes from 'prop-types';

/**
 * TokenModal
 * Modal to enter and verify a room token.
 * Props:
 * - visible: boolean
 * - token: string
 * - tokenError: string
 * - verifying: boolean
 * - onClose: () => void
 * - onChangeToken: (value: string) => void
 * - onSubmit: (event) => void
 */
const TokenModal = ({ visible, token, tokenError, verifying, onClose, onChangeToken, onSubmit }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Enter Access Token</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <label className="block text-sm text-gray-300 mb-2">Token</label>
          <input
            value={token}
            onChange={(e) => onChangeToken(e.target.value)}
            placeholder="Paste your room token"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-indigo-500"
            autoFocus
          />
          {tokenError && <p className="mt-2 text-sm text-red-400">{tokenError}</p>}

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default TokenModal;
 
TokenModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  tokenError: PropTypes.string,
  verifying: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeToken: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
