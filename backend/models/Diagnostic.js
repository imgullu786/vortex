import mongoose from 'mongoose';

const diagnosticSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'Diagnostic must belong to a patient']
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Diagnostic must belong to a doctor']
  },
  type: {
    type: String,
    enum: ['ecg', 'x-ray', 'ct-scan'],
    required: [true, 'Please specify diagnostic type']
  },
  date: {
    type: Date,
    default: Date.now
  },
  fileUrl: String,
  observations: [String],
  conclusion: String,
  riskScore: Number,
  data: Object // Raw diagnostic data
});

export default mongoose.model('Diagnostic', diagnosticSchema);