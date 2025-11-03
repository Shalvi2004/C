import Router from 'express';
import { getRoomsByOwner } from '../controllers/privateRoom.controller.js';
import { isUserAuthenticated } from '../middleware/userAuth.middleware.js';

const router = Router();

router.get('/private-room/get-room-by-owner', isUserAuthenticated, getRoomsByOwner);

export default router;