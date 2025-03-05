import { Router } from 'express';
import { getChatReplyV2 } from '../controllers/chat.controller';

const router = Router();

router.post('/', getChatReplyV2);

export default router;
