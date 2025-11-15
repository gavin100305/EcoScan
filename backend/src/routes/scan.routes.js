import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { 
  createScan, 
  getUserScans, 
  getScanById, 
  deleteScan 
} from '../controllers/scan.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create new scan (upload + analyze)
router.post('/', upload.single('image'), createScan);

// Get all scans for current user (history)
router.get('/', getUserScans);

// Get single scan by ID
router.get('/:id', getScanById);

// Delete scan
router.delete('/:id', deleteScan);

export default router;
