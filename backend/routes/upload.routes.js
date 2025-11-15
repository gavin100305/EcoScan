import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs';

const router = express.Router();

// Example upload endpoint
router.post('/upload', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  // Upload to Cloudinary
  const { url, publicId } = await uploadToCloudinary(req.file.path);

  // Delete temp file
  fs.unlinkSync(req.file.path);

  res.json(new ApiResponse(200, { url, publicId }, 'Image uploaded successfully'));
}));

export default router;
