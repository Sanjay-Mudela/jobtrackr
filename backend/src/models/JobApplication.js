const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    jobLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Online Test', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    source: {
      type: String,
      enum: ['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Other'],
      default: 'Other',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    ctc: {
      type: Number,
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
