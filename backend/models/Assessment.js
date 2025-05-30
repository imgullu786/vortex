import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'Assessment must belong to a patient']
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Assessment must belong to a doctor']
  },
  date: {
    type: Date,
    default: Date.now
  },
  symptoms: [String],
  possibleCauses: [String],
  suggestedTests: [String],
  treatmentSuggestions: [String],
  notes: String,
  diagnosis: String,
  followUpDate: Date
});

// Populate patient and doctor data when querying
assessmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient',
    select: 'name age gender'
  }).populate({
    path: 'doctor',
    select: 'name role avatar'
  });
  next();
});

export default mongoose.model('Assessment', assessmentSchema);