import express from 'express';
import { syncUser, getProfile, deleteUser } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/sync-user', syncUser);
router.get('/profile/:id', getProfile);
router.delete('/delete', authenticate, deleteUser);

export default router;
