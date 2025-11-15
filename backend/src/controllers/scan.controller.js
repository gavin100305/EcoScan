import { uploadToCloudinary } from '../config/cloudinary.js';
import { callGeminiVision } from '../utils/gemini.js';
import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';

// Create a new scan: upload image → analyze with Gemini → save to DB
export const createScan = asyncHandler(async (req, res) => {
  console.log('📸 createScan controller called');
  console.log('File:', req.file ? req.file.originalname : 'NO FILE');
  console.log('User:', req.user?.email);
  
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  // 1. Upload image to Cloudinary
  const { url, publicId } = await uploadToCloudinary(req.file.path, 'ecoscan');

  // Delete temp file
  try {
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error('Failed to delete temp file:', err);
  }

  // 2. Analyze image with Gemini
  console.log('🤖 Calling Gemini API with image:', url);
  const analysis = await callGeminiVision(url);
  console.log('✅ Gemini analysis complete:', analysis);

  // 3. Save scan to database
  const altSuggestions = Array.isArray(analysis.alternative_suggestions)
    ? JSON.stringify(analysis.alternative_suggestions)
    : String(analysis.alternative_suggestions ?? '');

  const scan = await prisma.scan.create({
    data: {
      userId,
      imagePath: url,
      productName: analysis.product_name,
      materialType: analysis.material_type,
      recyclability: analysis.recyclability,
      carbonFootprint: analysis.carbon_footprint,
      disposalMethod: analysis.disposal_method,
      alternativeSuggestions: altSuggestions,
    },
  });

  res.json(new ApiResponse(200, scan, 'Scan created successfully'));
});

// Get all scans for the authenticated user
export const getUserScans = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  const scans = await prisma.scan.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
  });

  res.json(new ApiResponse(200, scans, 'Scans retrieved successfully'));
});

// Get a single scan by ID
export const getScanById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  const scan = await prisma.scan.findFirst({
    where: { 
      id,
      userId // Ensure user can only access their own scans
    },
  });

  if (!scan) {
    throw new ApiError(404, 'Scan not found');
  }

  res.json(new ApiResponse(200, scan, 'Scan retrieved successfully'));
});

// Delete a scan
export const deleteScan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }

  const scan = await prisma.scan.findFirst({
    where: { id, userId },
  });

  if (!scan) {
    throw new ApiError(404, 'Scan not found');
  }

  await prisma.scan.delete({
    where: { id },
  });

  res.json(new ApiResponse(200, null, 'Scan deleted successfully'));
});
