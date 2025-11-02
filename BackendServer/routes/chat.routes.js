import Router from 'express';
import { chatController, checkToken } from '../controllers/chatController.js';
import {isUserAuthenticated} from '../middleware/userAuth.middleware.js';

const router = Router();

router.get('/chat/room', isUserAuthenticated, chatController);

// router.post('/chat/createToken', chatController);
router.post("/chat/token", isUserAuthenticated, checkToken);
export default router;  