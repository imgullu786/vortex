import Patient from '../models/Patient.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllPatients = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Patient.find(),
      req.query
    ).filter().sort().limitFields().paginate();

    const patients = await features.query;

    res.status(200).json({
      status: 'success',
      results: patients.length,
      data: patients
    });
  } catch (err) {
    next(err);
  }
};

export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return next(new AppError('No patient found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

export const createPatient = async (req, res, next) => {
  try {
    const { name, age, gender, contact, address, medicalHistory } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      medicalHistory,
      createdBy: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!patient) {
      return next(new AppError('No patient found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return next(new AppError('No patient found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};