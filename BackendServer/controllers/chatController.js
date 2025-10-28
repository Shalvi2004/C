import crypto from 'crypto';

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

export const chatController = (req,res)=>{
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

    // Generate token and return along with an echo of submitted data
    const token = randomTokenGenerator(20);
    // Log minimal info for debugging (do not log tokens in production)
    console.log(`Generated token for room="${roomName}" participants=${p}`);

    return res.status(200).json({ token, roomName: roomName.trim(), participants: p });
}
