import prisma from '../config/prisma.js';

// Assumes `authenticate` middleware already ran and set `req.user` (Supabase user object)
export const attachProfile = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    // Attach profile (may be null if not yet synced)
    req.profile = profile;
    next();
  } catch (err) {
    next(err);
  }
};
