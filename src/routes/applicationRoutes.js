const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const authenticate = require('../middleware/authMiddleware');
const parseResume = require('../services/resumeParsing');

// Submit a new application
router.post('/', async (req, res) => {
  try {
    const resume = req.body.resume;
    const parsedResume = await parseResume(resume);
    const application = new Application({
      ...req.body,
      parsedResume,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting application', error: error.message });
  }
});

// Get all applications for a job (for employers)
router.get('/job/:jobId', authenticate, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, employer: req.user.id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or you are not authorized to view its applications' });
    }
    const applications = await Application.find({ job: req.params.jobId }).populate('applicant', ['firstName', 'lastName', 'email']);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Get all applications for a user (for job seekers)
router.get('/user', authenticate, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate('job', ['title', 'company']);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Update application status (for employers)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error updating application', error: error.message });
  }
});

module.exports = router;