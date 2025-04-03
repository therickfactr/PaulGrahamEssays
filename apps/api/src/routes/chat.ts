import { Router } from 'express';
import { chat } from '../controllers/chatController';

const router = Router();

router.post('/documents/chat', chat);

export default router; 