import crypto from 'crypto';
import { Chat } from '../modals/chat.modal.js';

function randomTokenGenerator(length, roomName = '', participants = '') {
    // Create a seed that incorporates roomName and participants so tokens are influenced by them.
    const seed = `${roomName.trim()}|${participants}`;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Use a SHA-256 hash of seed + random salt to produce high-entropy bytes
    const salt = crypto.randomBytes(8).toString('hex');
    const digest = crypto.createHash('sha256').update(seed + '|' + salt).digest();

    let token = '';
    for (let i = 0; i < length; i++) {
        // Use digest bytes to index into allowed characters
        const idx = digest[i % digest.length] % characters.length;
        token += characters.charAt(idx);
    }
    return token;
}
// todo : We save the chat tokens in database with room info and expiry time etc for production use.

export const chatController = async (req,res)=>{
    // Read roomName and participants from query parameters (GET request)
    const { roomName = '', participants = '' } = req.query || {};

    // Basic validation
    const p = parseInt(participants, 10);
    if (!roomName || !roomName.trim()) {
        return res.status(400).json({ message: 'roomName query parameter is required' });
    }
    if (Number.isNaN(p) || p <= 0) {
        return res.status(400).json({ message: 'participants must be a positive integer' });
    }

    // Optionally, you might enforce a maximum participants limit here
    if (p > 50) {
        return res.status(400).json({ message: 'participants exceeds maximum allowed (50)' });
    }

    // Generate token and expiry 
    const TOKEN_LENGTH = 20;
    const TOKEN_TTL_MINUTES = 60 * 24; // ! default 24 hours; changeable

    let token = randomTokenGenerator(TOKEN_LENGTH, roomName, participants);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    // Try saving the chat document; if token collision occurs, retry a few times
    const MAX_TRIES = 3;
    let savedChat = null;
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
        try {
            const ownerId = req.user && req.user.id;
            if (!ownerId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            let participantsArray;
            if (Array.isArray(req.query.participants)) {
                participantsArray = req.query.participants.slice();
                if (!participantsArray.includes(ownerId)) participantsArray.unshift(ownerId);
            } else {
                // Create placeholder participant ids but ensure owner is included as first participant
                participantsArray = [ownerId, ...Array.from({ length: Math.max(0, p - 1) }).map((_, i) => `participant_${i + 2}`)];
            }

            const chatDoc = new Chat({
                roomName: roomName.trim(),
                participants: participantsArray,
                owner: ownerId,
                verificationCode: crypto.randomBytes(6).toString('hex'),
                token,
                tokenExpiresAt,
            });
            savedChat = await chatDoc.save();
            break;
        } catch (err) {
            // ! If duplicacy err occurs
            if (err && err.code === 11000 && err.keyPattern && err.keyPattern.token) {
                console.warn(`Token collision on attempt ${attempt}, regenerating token.`);
                // regenerate token
                token = randomTokenGenerator(TOKEN_LENGTH, roomName, participants + Date.now());
                continue;
            }
            console.error('Error saving chat document:', err);
            return res.status(500).json({ message: 'Failed to create chat room' });
        }
    }

    if (!savedChat) {
        return res.status(500).json({ message: 'Unable to generate unique token, please try again' });
    }

    // Log minimal info for debugging (do not log tokens in production)
    console.log(`Created chat room="${savedChat.roomName}" token=${savedChat.token} expiresAt=${savedChat.tokenExpiresAt.toISOString()}`);

    return res.status(201).json({ token: savedChat.token, tokenExpiresAt: savedChat.tokenExpiresAt, roomName: savedChat.roomName, participants: savedChat.participants.length, owner: savedChat.owner });
}

export const checkToken = async(req,res)=>{
    const roomName = (req.query.roomName || '').trim();
    const token = (req.body && req.body.token) ? String(req.body.token).trim() : (req.headers['x-room-token'] || '').trim();

    if (!roomName) {
        return res.status(400).json({ message: 'roomName query parameter is required' });
    }
    if (!token) {
        return res.status(400).json({ message: 'Token is required (in request body `token` or `x-room-token` header)' });
    }

    try {
        const room = await Chat.findOne({ roomName });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        if (!room.token || String(room.token).trim() !== token) {
            return res.status(401).json({ message: 'Invalid token for this room' });
        }

        if (room.tokenExpiresAt && room.tokenExpiresAt < new Date()) {
            return res.status(410).json({ message: 'Token has expired' });
        }

        return res.status(200).json({ message: 'Token is valid', roomName: room.roomName, participants: room.participants });
    } catch (error) {
        console.error('Error checking token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}