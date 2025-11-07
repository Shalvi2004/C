import {Chat} from '../modals/chat.modal.js';

export const getRoomsByOwner = async (req, res) => {
    const ownerId = req.user && req.user.id;
    if (!ownerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Only fetch rooms that have a token and where the token has not expired
        const now = new Date();
        const rooms = await Chat.find({
            owner: ownerId,
            token: { $exists: true, $ne: null },
            tokenExpiresAt: { $gt: now }
        }).sort({ createdAt: -1 });

        // Map to minimal safe payload
        const data = rooms.map(room => ({
            roomName: room.roomName,
            participantsCount: Array.isArray(room.participants) ? room.participants.length : 0,
            id: room._id,
        }));

        return res.json(data);
    } catch (error) {
        console.error('Error fetching rooms by owner:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
