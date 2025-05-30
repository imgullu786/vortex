import express from 'express';
import {
  getAllAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  analyzeSymptoms
} from '../controllers/assessmentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAllAssessments)
  .post(createAssessment);

router
  .route('/:id')
  .get(getAssessment)
  .patch(updateAssessment)
  .delete(deleteAssessment);

router.post('/analyze-symptoms', analyzeSymptoms);

export default router;