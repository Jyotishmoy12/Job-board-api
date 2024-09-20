const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String }, // Path to the resume file or content
  coverLetter: { type: String }, // Path to the cover letter file or content
  status: { type: String, enum: ['applied', 'rejected', 'accepted'], default: 'applied' }
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;