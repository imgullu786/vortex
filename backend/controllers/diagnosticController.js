import Diagnostic from '../models/Diagnostic.js';
import Patient from '../models/Patient.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllDiagnostics = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Diagnostic.find(),
      req.query
    ).filter().sort().limitFields().paginate();

    const diagnostics = await features.query;

    res.status(200).json({
      status: 'success',
      results: diagnostics.length,
      data: diagnostics
    });
  } catch (err) {
    next(err);
  }
};

export const getDiagnostic = async (req, res, next) => {
  try {
    const diagnostic = await Diagnostic.findById(req.params.id);

    if (!diagnostic) {
      return next(new AppError('No diagnostic found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: diagnostic
    });
  } catch (err) {
    next(err);
  }
};

export const createDiagnostic = async (req, res, next) => {
  try {
    const { patientId, type, observations, conclusion, riskScore, data } = req.body;

    const diagnostic = await Diagnostic.create({
      patient: patientId,
      doctor: req.user.id,
      type,
      observations,
      conclusion,
      riskScore,
      data,
      fileUrl: req.file ? req.file.path : undefined
    });

    res.status(201).json({
      status: 'success',
      data: diagnostic
    });
  } catch (err) {
    next(err);
  }
};

export const analyzeDiagnosticData = async (req, res, next) => {
  try {
    const { type, data } = req.body;
    
    // Mock analysis - in real app, you would call your AI/ML service
    const mockAnalysis = {
      riskScore: Math.floor(Math.random() * 100),
      observations: ['Regular rhythm', 'Normal QRS complex', 'No ST-segment abnormalities'],
      conclusion: 'Normal ECG findings. No evidence of acute cardiac pathology.'
    };

    res.status(200).json({
      status: 'success',
      data: mockAnalysis
    });
  } catch (err) {
    next(err);
  }
};