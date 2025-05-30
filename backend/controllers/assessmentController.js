import Assessment from '../models/Assessment.js';
import Patient from '../models/Patient.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllAssessments = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Assessment.find(),
      req.query
    ).filter().sort().limitFields().paginate();

    const assessments = await features.query;

    res.status(200).json({
      status: 'success',
      results: assessments.length,
      data: assessments
    });
  } catch (err) {
    next(err);
  }
};

export const getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return next(new AppError('No assessment found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: assessment
    });
  } catch (err) {
    next(err);
  }
};

export const createAssessment = async (req, res, next) => {
  try {
    const { patientId, symptoms, possibleCauses, suggestedTests, treatmentSuggestions, notes } = req.body;

    const assessment = await Assessment.create({
      patient: patientId,
      doctor: req.user.id,
      symptoms,
      possibleCauses,
      suggestedTests,
      treatmentSuggestions,
      notes
    });

    res.status(201).json({
      status: 'success',
      data: assessment
    });
  } catch (err) {
    next(err);
  }
};

export const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!assessment) {
      return next(new AppError('No assessment found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: assessment
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);

    if (!assessment) {
      return next(new AppError('No assessment found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

export const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    
    // In a real app, you would call your AI/ML service here
    // This is a mock implementation
    const mockResponse = {
      symptoms: symptoms.split(',').map(s => s.trim()),
      possibleCauses: ['Upper respiratory infection', 'Mild pneumonia', 'Bronchitis'],
      suggestedTests: ['Chest X-ray', 'Blood culture', 'Sputum analysis'],
      treatmentSuggestions: ['Antibiotics if bacterial', 'Rest', 'Increased fluid intake']
    };

    res.status(200).json({
      status: 'success',
      data: mockResponse
    });
  } catch (err) {
    next(err);
  }
};