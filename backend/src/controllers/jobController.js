const JobApplication = require('../models/JobApplication');

// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const {
      company,
      position,
      jobLink,
      status,
      source,
      appliedDate,
      followUpDate,
      ctc,
      location,
      notes,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: 'Company and position are required' });
    }

    const job = await JobApplication.create({
      user: req.user._id,
      company,
      position,
      jobLink,
      status,
      source,
      appliedDate,
      followUpDate,
      ctc,
      location,
      notes,
    });

    res.status(201).json({
      message: 'Job application created successfully',
      job,
    });
  } catch (error) {
    console.error('Create job error:', error.message);
    res.status(500).json({ message: 'Server error while creating job' });
  }
};

// @desc    Get all job applications for logged-in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: jobs.length, jobs });
  } catch (error) {
    console.error('Get jobs error:', error.message);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

// @desc    Get single job application
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job by id error:', error.message);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
};

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    res.json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    console.error('Update job error:', error.message);
    res.status(500).json({ message: 'Server error while updating job' });
  }
};

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error.message);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
