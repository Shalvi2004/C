import Router from 'express';
import { chatController, checkToken } from '../controllers/chatController.js';
import {isUserAuthenticated} from '../middleware/userAuth.middleware.js';

const router = Router();

// Create a room token (supports GET for backward compatibility, prefer POST)
router.get('/chat/room', isUserAuthenticated, chatController);
router.post('/chat/room', isUserAuthenticated, chatController);

// Verify a room token
router.post('/chat/token', isUserAuthenticated, checkToken); // legacy path
router.post('/chat/token/verify', isUserAuthenticated, checkToken);

export default router;  