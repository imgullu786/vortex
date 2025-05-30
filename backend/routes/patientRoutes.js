import express from 'express';
import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAllPatients)
  .post(createPatient);

router
  .route('/:id')
  .get(getPatient)
  .patch(updatePatient)
  .delete(deletePatient);

export default router;