import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    throw new ApiError(400, error.message);
  }

  res.json(new ApiResponse(200, data, 'User created successfully'));
});

export const verifyToken = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, { user: req.user }, 'Token verified'));
});
