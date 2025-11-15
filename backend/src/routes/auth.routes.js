import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { signup, verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-token', authenticate, verifyToken);

export default router;
