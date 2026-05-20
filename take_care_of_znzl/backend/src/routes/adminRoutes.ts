import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);
router.get('/users', adminController.listUsers);
router.post('/sticker-complete', adminController.completeSticker);
router.post('/users/delete', adminController.deleteUsers);

export default router;
