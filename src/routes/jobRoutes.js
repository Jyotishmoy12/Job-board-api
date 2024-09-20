const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authenticate = require('../middleware/authMiddleware');
const analyzeJobDescription = require('../services/jobDescriptionAnalysis');

// Create a new job
router.post('/', async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const analyzedJobDescription = analyzeJobDescription(jobDescription);
    const job = new Job({
      ...req.body,
      analyzedJobDescription,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job', error: error.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', ['firstName', 'lastName', 'company']); // Corrected line
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Get a specific job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', ['firstName', 'lastName', 'company']);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
});

// Update a job
router.put('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found or you are not authorized to edit it' });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job', error: error.message });
  }
});

// Delete a job
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or you are not authorized to delete it' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
});

module.exports = router;
