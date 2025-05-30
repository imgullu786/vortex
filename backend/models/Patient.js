import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide patient name']
  },
  age: {
    type: Number,
    required: [true, 'Please provide patient age']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please specify gender']
  },
  contact: String,
  address: String,
  medicalHistory: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model('Patient', patientSchema);