import { supabaseAdmin } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  console.log('🔐 Auth middleware - Method:', req.method, 'Path:', req.path);
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    console.log('❌ Invalid token:', error?.message);
    return res.status(401).json({ error: 'Invalid token' });
  }

  console.log('✅ User authenticated:', user.email);
  req.user = user;
  next();
};
