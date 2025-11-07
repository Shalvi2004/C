import crypto from 'crypto';
import { Chat } from '../modals/chat.modal.js';
import { generateRoomToken, generateVerificationCode, getTokenTTLMinutes } from '../utils/token.js';

export const chatController = async (req,res)=>{
    // Prefer body (POST) but fallback to query (GET) for backward compatibility
    const body = req.body || {};
    const q = req.query || {};
    const roomNameRaw = (body.roomName ?? body.name ?? q.roomName ?? '').toString();
    const participantsRaw = (body.participants ?? q.participants);

    // Basic validation
    const roomName = roomNameRaw.trim();
    if (!roomName) {
        return res.status(400).json({ message: 'roomName query parameter is required' });
    }
    // Participants can be an array of IDs/usernames; default to owner only if not provided.
    // For legacy GET flow where participants was a number, we accept a positive integer but we no longer create placeholders.
    let participantsArray = [];
    if (Array.isArray(participantsRaw)) {
        participantsArray = participantsRaw.map(String);
    } else if (participantsRaw !== undefined) {
        const pInt = parseInt(participantsRaw, 10);
        if (Number.isNaN(pInt) || pInt <= 0) {
            return res.status(400).json({ message: 'participants must be a positive integer when provided as count' });
        }
        // In production, avoid placeholder participants; we'll use only the owner below.
    }

    // Generate token and expiry 
    const TOKEN_BYTES = 16; // 128-bit token
    const TOKEN_TTL_MINUTES = getTokenTTLMinutes(60 * 24); // default 24 hours or env TOKEN_TTL_MINUTES

    let token = generateRoomToken(TOKEN_BYTES);
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

            // Ensure owner is always the first participant and uniqueness of list
            const set = new Set([ownerId, ...participantsArray]);
            participantsArray = Array.from(set);

            const chatDoc = new Chat({
                roomName: roomName.trim(),
                participants: participantsArray,
                owner: ownerId,
                verificationCode: generateVerificationCode(6),
                token,
                tokenExpiresAt,
            });
            savedChat = await chatDoc.save();
            break;
        } catch (err) {
            // ! If duplicacy err occurs
            if (err && err.code === 11000) {
                // Duplicate token or roomName; distinguish by key
                if (err.keyPattern && err.keyPattern.token) {
                    // regenerate token and retry
                    token = generateRoomToken(TOKEN_BYTES);
                    continue;
                }
                if (err.keyPattern && err.keyPattern.roomName) {
                    return res.status(409).json({ message: 'Room name already exists' });
                }
            }
            console.error('Error saving chat document:', err);
            return res.status(500).json({ message: 'Failed to create chat room' });
        }
    }

    if (!savedChat) {
        return res.status(500).json({ message: 'Unable to generate unique token, please try again' });
    }

    // Log minimal info for debugging (never log tokens in production)
    console.log(`Created chat room="${savedChat.roomName}" owner=${savedChat.owner} exp=${savedChat.tokenExpiresAt.toISOString()}`);

    return res.status(201).json({
        token: savedChat.token,
        tokenExpiresAt: savedChat.tokenExpiresAt,
        roomName: savedChat.roomName,
        participants: savedChat.participants.length,
        owner: savedChat.owner,
    });
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