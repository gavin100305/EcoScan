import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const syncUser = asyncHandler(async (req, res) => {
  const { id, email, fullName } = req.body;

  if (!id) {
    throw new ApiError(400, 'User ID is required');
  }

  const profile = await prisma.profile.upsert({
    where: { id },
    update: { email, fullName },
    create: { id, email, fullName }
  });

  res.json(new ApiResponse(200, profile, 'Profile synced successfully'));
});

export const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const profile = await prisma.profile.findUnique({
    where: { id }
  });

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  res.json(new ApiResponse(200, profile, 'Profile retrieved successfully'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  // Delete all user's scans first (cascade should handle this, but being explicit)
  await prisma.scan.deleteMany({
    where: { userId }
  });

  // Delete user profile
  await prisma.profile.delete({
    where: { id: userId }
  });

  res.json(new ApiResponse(200, null, 'User account deleted successfully'));
});
