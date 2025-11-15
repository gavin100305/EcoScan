import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

router.post('/sync-user', async (req, res) => {
  const { id, email, fullName } = req.body;
  
  await prisma.profile.upsert({
    where: { id },
    update: { email, fullName },
    create: { id, email, fullName }
  });
  
  res.json({ success: true });
});

router.get('/profile/:id', async (req, res) => {
  const profile = await prisma.profile.findUnique({
    where: { id: req.params.id }
  });
  
  res.json(profile);
});

export default router;
