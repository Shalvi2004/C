import crypto from 'crypto';

// Generate a URL-safe random token using base64url
export function generateRoomToken(byteLength = 16) {
  // 16 bytes -> 22 char base64url string; increase for higher entropy
  return crypto.randomBytes(byteLength).toString('base64url');
}

// Generate a short human-readable verification code (hex, 12 chars)
export function generateVerificationCode(byteLength = 6) {
  return crypto.randomBytes(byteLength).toString('hex');
}

// Parse TTL minutes from env or fallback
export function getTokenTTLMinutes(defaultMinutes = 60 * 24) {
  const raw = process.env.TOKEN_TTL_MINUTES;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultMinutes;
  return parsed;
}
