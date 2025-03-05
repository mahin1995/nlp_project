import { Router } from 'express';
import { getChatReply, getChatReplyV2 } from '../controllers/chat.controller';

const router = Router();

router.post('/', getChatReply);
router.post('/v2', getChatReplyV2);

export default router;
