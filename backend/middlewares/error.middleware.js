import { ApiError } from '../utils/ApiError.js';

export default function errorHandler(err, req, res, next) {
  // If already an ApiError, use its data
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      data: null,
    });
  }

  // Prisma common error mappings
  if (err && err.code) {
    // Unique constraint
    if (err.code === 'P2002') {
      const target = (err.meta && err.meta.target) || [];
      return res.status(409).json({ success: false, message: 'Duplicate record', errors: target, data: null });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Record not found', errors: [], data: null });
    }
  }

  // Supabase-style error objects sometimes have `status` and `message`
  if (err && err.status && err.message) {
    return res.status(err.status).json({ success: false, message: err.message, errors: err.errors || [], data: null });
  }

  // Default: Internal Server Error
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) console.error(err);

  const message = isProd ? 'Internal server error' : (err && (err.message || String(err))) || 'Internal server error';
  res.status(500).json({ success: false, message, errors: [], data: null });
}
