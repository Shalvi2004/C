import Router from 'express';
import { chatController } from '../controllers/chatController.js';

const router = Router();

router.get('/chat/token', chatController);

// router.post('/chat/createToken', chatController);

export default router;