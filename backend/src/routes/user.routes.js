import express from 'express';
import { syncUser, getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/sync-user', syncUser);
router.get('/profile/:id', getProfile);

export default router;
