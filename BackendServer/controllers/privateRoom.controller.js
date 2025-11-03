import {Chat} from '../modals/chat.modal.js';

export const getRoomsByOwner = async (req, res) => {
    const ownerId = req.user && req.user.id;
    if (!ownerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const rooms = await Chat.find({ owner: ownerId });
        const data = rooms.map(room => ({
            roomName: room.roomName,
            participantsCount: room.participants.length
        }));
        return res.json(data);
    } catch (error) {
        console.error('Error fetching rooms by owner:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
