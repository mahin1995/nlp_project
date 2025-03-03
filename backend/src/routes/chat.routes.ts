import { Router } from 'express';
import { getChatReply } from '../controllers/chat.controller';

const router = Router();

router.post('/', getChatReply);

export default router;
