const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: user.toAuthJSON() });
  } catch (err) {
    res.status(400).json({ message: 'Error logging in', error: err.message });
  }
});

router.post('/create', authenticate, async (req, res) => {
    try {
      const job = new Job({ ...req.body, employer: req.user._id });
      await job.save();
      res.json({ message: 'Job created successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Error creating job' });
    }
  });

module.exports = router;