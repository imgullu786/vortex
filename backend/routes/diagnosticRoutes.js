import express from 'express';
import {
  getAllDiagnostics,
  getDiagnostic,
  createDiagnostic,
  analyzeDiagnosticData
} from '../controllers/diagnosticController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAllDiagnostics)
  .post(upload.single('file'), createDiagnostic);

router.route('/:id').get(getDiagnostic);
router.post('/analyze', analyzeDiagnosticData);

export default router;