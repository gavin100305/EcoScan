import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

router.post('/verify-token', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
