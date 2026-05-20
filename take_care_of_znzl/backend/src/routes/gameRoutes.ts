import { Router } from 'express';
import * as gameController from '../controllers/gameController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/me', gameController.getMe);
router.post('/activity', gameController.activity);
router.post('/sticker-request', gameController.stickerRequest);

export default router;
