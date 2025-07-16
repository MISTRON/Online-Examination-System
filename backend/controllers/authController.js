const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Save a result (student submits an exam)
exports.saveResult = async (req, res) => {
  try {
    const { user, exam, score, totalScore, percentage, passed, answers } = req.body;
    if (!user || !exam || score == null || totalScore == null || percentage == null || passed == null || !answers) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Prevent duplicate submissions
    const existing = await Result.findOne({ user, exam });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted this exam.' });
    }
    const result = new Result({ user, exam, score, totalScore, percentage, passed, answers });
    await result.save();
    res.status(201).json({ message: 'Result saved successfully', result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch results for a user
exports.getUserResults = async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await Result.find({ user: userId }).populate('exam', 'title');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch all results (for admin/teacher, or filtered by user/exam)
exports.getAllResults = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;
    if (req.query.exam) filter.exam = req.query.exam;
    const results = await Result.find(filter)
      .populate('user', 'name email')
      .populate('exam', 'title');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }
    // Simulate sending email (in production, send a real email with a token)
    // Generate a fake token for now
    const resetToken = Math.random().toString(36).substr(2);
    // Log the reset link (simulate email)
    console.log(`Password reset link for ${email}: http://localhost:3000/reset-password/${resetToken}`);
    // Respond
    return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 