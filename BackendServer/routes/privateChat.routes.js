import Router from 'express';
import { getallPrivateRooms } from '../controllers/privateRoom.controller.js';

const router = Router();

router.get('/private-room/get-room-by-user',getallPrivateRooms)

export default router;