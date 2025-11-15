import { uploadToCloudinary } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  // Upload to Cloudinary
  const { url, publicId } = await uploadToCloudinary(req.file.path, 'ecoscan');

  // Delete temp file
  try {
    fs.unlinkSync(req.file.path);
  } catch (err) {
    // Log but don't fail if temp file cleanup fails
    console.error('Failed to delete temp file:', err);
  }

  res.json(new ApiResponse(200, { url, publicId }, 'Image uploaded successfully'));
});
