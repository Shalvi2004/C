import Router from 'express';
import { chatController } from '../controllers/chatController.js';
import {isUserAuthenticated} from '../middleware/userAuth.middleware.js';

const router = Router();

router.get('/chat/token', isUserAuthenticated, chatController);

// router.post('/chat/createToken', chatController);

export default router;